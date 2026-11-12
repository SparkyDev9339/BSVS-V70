import type { OfflineBattleResults } from '../OfflineBattleResults';
import { nativeFunctions, platformOffsets } from '../../offsets';
import { KnockoutMatch, knockoutRules } from '../knockout/KnockoutMatch';
import { replaceIsGameOver } from './LogicBattleModeServer_isGameOver';
import { createSnapshotRefresh } from './LogicGameObjectManager_refreshSnapshot';
import { cancelMovement, replaceCalculateMovement } from './LogicCharacter_calculateMovement';
import { installChargeMovement } from './LogicCharacter_activateSkill';
import { replaceBotTick } from './LogicBot_tick';
import { HotZoneSimulation, type HotZoneSession } from '../hotzone/HotZoneSimulation';
import { syncPlayerAlive } from '../PlayerState';
import {
  LogicBattleModeServerTickTurrets,
  type TurretAuras,
} from './LogicBattleModeServer_tickTurrets';

export type BattleSession = {
  battle: NativePointer;
  match: KnockoutMatch | null;
  hotzone?: HotZoneSession;
  spawns: Map<number, NativePointer[]>;
  homes: Map<number, [number, number, number]>;
  deaths: Map<number, number>;
  turretAuras: TurretAuras;
  turretEffectsFailed?: boolean;
  failed: boolean;
};

function respawnDelaySeconds(battle: NativePointer): number {
  if (battle.add(220).readS32() === 20) return 0;
  const mode = battle.add(224).readPointer();
  const seconds = mode.isNull() ? 0 : mode.add(816).readS32();
  return seconds > 0 && seconds <= 30 ? seconds : 0;
}

function respawnRoster(battle: NativePointer): { count: number; players: NativePointer } {
  const count = battle.add(96).readS32();
  const players = battle.add(112).readPointer();
  if (count < 1 || count > 10 || players.isNull()) throw new Error('Invalid respawn roster');
  return { count, players };
}

export class LogicBattleModeServerTick {
  private sessions = new Map<string, BattleSession>();
  private hooks: InvocationListener[] = [];
  private callbacks: NativeCallback<any, any>[] = [];
  private lastStatus: unknown = null;
  private lastHotZoneStatus: unknown = null;
  constructor(
    base: NativePointer,
    onError: (error: unknown) => void,
    results?: OfflineBattleResults,
  ) {
    const N = platformOffsets.knockout;
    const native = nativeFunctions(base);
    let hotzone: HotZoneSimulation | null = null;
    let turrets: LogicBattleModeServerTickTurrets | null = null;
    const controlStart = native.knockout.controlStart;
    const findObject = native.knockout.findObject;
    const clearObjects = native.knockout.clearObjects;
    const resetMap = native.knockout.resetMap;
    const arrange = native.knockout.arrange;
    const spawn = native.knockout.spawn;
    const spawnSaved = (args: NativePointer[], x: number, y: number, z: number): NativePointer =>
      spawn(
        args[0],
        args[1],
        args[2],
        args[3],
        args[4].toUInt32(),
        args[5].toUInt32(),
        args[6].toInt32(),
        args[7].toInt32() & 255,
        x >>> 0,
        y >>> 0,
        z >>> 0,
        args[11].toUInt32(),
        args[12].toUInt32(),
      );
    const updatePositions = native.knockout.updatePositions;
    const allocate = native.messaging.allocate;
    const eligible = (battle: NativePointer) =>
      !battle.isNull() && battle.add(220).readS32() === 20 && battle.add(240).readU8() === 1;
    const session = (battle: NativePointer): BattleSession => {
      const key = battle.toString();
      let state = this.sessions.get(key);
      if (!state) {
        state = {
          battle,
          match: null,
          spawns: new Map(),
          homes: new Map(),
          deaths: new Map(),
          turretAuras: new Map(),
          failed: false,
        };
        this.sessions.set(key, state);
      }
      return state;
    };
    const fail = (state: BattleSession, error: unknown) => {
      state.failed = true;
      onError(new Error(`Knockout: ${String(error)}`));
    };
    this.hooks.push(
      Interceptor.attach(base.add(N.constructor), {
        onEnter: args => {
          this.sessions.delete(args[0].toString());
          this.lastStatus = null;
          this.lastHotZoneStatus = null;
          results?.begin(args[0].toString());
        },
      }),
    );
    this.hooks.push(
      Interceptor.attach(base.add(N.destructor), {
        onEnter: args => {
          this.sessions.delete(args[0].toString());
        },
      }),
    );
    this.hooks.push(
      Interceptor.attach(base.add(N.spawnCharacter), {
        onEnter(args) {
          if (args[0].add(240).readU8() !== 1) return;
          const state = session(args[0]);
          const index = args[4].toInt32();
          if (index >= 0 && index < 10) {
            const saved = Array.from({ length: 8 }, (_, i) => ptr(args[i].toString()));

            saved.push(
              ptr(this.context.sp.readU32()),
              ptr(this.context.sp.add(4).readU32()),
              ptr(this.context.sp.add(8).readU32()),
              ptr(this.context.sp.add(12).readU8()),
              ptr(this.context.sp.add(13).readU8()),
            );
            state.spawns.set(index, saved);
          }
        },
      }),
    );
    this.hooks.push(
      Interceptor.attach(base.add(N.arrangePlayers), {
        onEnter(args) {
          this.battle = args[0];
        },
        onLeave: function () {
          const battle = this.battle as NativePointer;
          if (battle.add(240).readU8() !== 1) return;
          const state = session(battle);
          try {
            const count = battle.add(96).readS32(),
              players = battle.add(112).readPointer();
            if (count < 1 || count > 10 || players.isNull())
              throw new Error('Invalid offline roster');
            for (let i = 0; i < count; i++) {
              const player = players.add(i * 8).readPointer();
              if (player.isNull()) throw new Error('Missing offline player');
              results?.record(
                battle.toString(),
                battle.add(220).readS32(),
                i,
                player.add(108).readS32(),
                player.add(169).readU8() !== 0,
              );
              const hero = findObject(battle.readPointer(), player.add(112).readS32());
              if (!hero.isNull() && !state.homes.has(i))
                state.homes.set(i, [
                  hero.add(56).readS32(),
                  hero.add(60).readS32(),
                  hero.add(64).readS32(),
                ]);
            }
          } catch (e) {
            onError(new Error(`Battle roster: ${String(e)}`));
          }
          if (battle.add(240).readU8() === 1 && battle.add(220).readS32() === 17) {
            if (!state.hotzone && !state.failed)
              try {
                hotzone ??= new HotZoneSimulation(base, results);
                state.hotzone = hotzone.initialize(battle);
              } catch (e) {
                state.failed = true;
                onError(new Error(`Hot Zone: ${String(e)}`));
              }
            return;
          }
          if (!eligible(battle)) return;
          if (state.match || state.failed) return;
          try {
            if (battle.add(96).readS32() !== 6 || state.spawns.size !== 6)
              throw new Error('Knockout requires two complete teams of three');
            if (!battle.add(1080).readPointer().isNull())
              throw new Error('Unexpected existing Knockout round vector');
            const rounds = allocate(12);
            if (rounds.isNull()) throw new Error('Cannot allocate Knockout results');
            for (let i = 0; i < 3; i++) rounds.add(i * 4).writeS32(-1);

            battle.add(1080).writePointer(rounds);
            battle.add(1088).writeS32(3);
            battle.add(1092).writeS32(3);
            const tick = battle.add(16).readS32();
            state.match = new KnockoutMatch(
              tick,
              knockoutRules,
              Math.max(0, controlStart(battle) - tick),
            );
            console.log('[offline-v70] Knockout: 3v3, best of 3');
          } catch (e) {
            fail(state, e);
          }
        },
      }),
    );
    const getSession = (battle: NativePointer) => this.sessions.get(battle.toString());
    this.callbacks.push(replaceIsGameOver(base, getSession));
    const pausedBot = (hero: NativePointer): boolean => {
      if (hero.isNull() || hero.add(1609).readU8() !== 1) return false;
      const manager = hero.add(32).readPointer();
      if (manager.isNull()) return false;
      const state = getSession(manager.add(296).readPointer());
      return !!state?.match && !state.failed && state.match.phase !== 'playing';
    };
    this.hooks.push(replaceCalculateMovement(base, pausedBot));
    this.hooks.push(...installChargeMovement(base));
    this.callbacks.push(replaceBotTick(base, pausedBot));
    const refreshSnapshot = createSnapshotRefresh(base);
    const self = this;
    this.hooks.push(
      Interceptor.attach(base.add(N.step), {
        onEnter(args) {
          const battle = args[0];
          this.battle = battle;
          const state = self.sessions.get(battle.toString());
          if (!state || state.match || state.failed || battle.add(240).readU8() !== 1) return;
          try {
            const seconds = respawnDelaySeconds(battle);
            if (!seconds || !state.deaths.size) return;
            if (
              battle.add(161).readU8() !== 0 ||
              battle.add(249).readU8() !== 0 ||
              (state.hotzone && state.hotzone.match.winner !== null)
            )
              return;
            const tick = battle.add(16).readS32();
            const { count, players } = respawnRoster(battle);
            for (let i = 0; i < count; i++) {
              const died = state.deaths.get(i),
                saved = state.spawns.get(i),
                home = state.homes.get(i);
              if (died === undefined || tick - died < seconds * 20 || !saved || !home) continue;
              const player = players.add(i * 8).readPointer();
              const oldHero = findObject(battle.readPointer(), player.add(112).readS32());
              if (syncPlayerAlive(player, oldHero, tick)) {
                state.deaths.delete(i);
                continue;
              }
              const body = spawnSaved(saved, home[0], home[1], home[2]);
              if (body.isNull()) throw new Error(`Failed to respawn player ${i}`);
              player.add(112).writeS32(body.add(8).readS32());
              player.add(168).writeU8(1);
              state.deaths.delete(i);
            }
          } catch (e) {
            state.failed = true;
            onError(new Error(`Respawn: ${String(e)}`));
          }
        },
        onLeave() {
          const battle = this.battle as NativePointer;
          const state = self.sessions.get(battle.toString());
          if (
            state &&
            !state.failed &&
            !state.turretEffectsFailed &&
            battle.add(240).readU8() === 1
          ) {
            try {
              turrets ??= new LogicBattleModeServerTickTurrets(base);
              turrets.update(battle, state.turretAuras);
            } catch (e) {
              state.turretEffectsFailed = true;
              onError(new Error(`Turret effects disabled for this battle: ${String(e)}`));
            }
          }
          if (state && !state.match && !state.failed && battle.add(240).readU8() === 1) {
            try {
              const seconds = respawnDelaySeconds(battle);
              if (seconds && state.homes.size) {
                const tick = battle.add(16).readS32();
                const { count, players } = respawnRoster(battle);
                for (let i = 0; i < count; i++) {
                  const saved = state.spawns.get(i),
                    home = state.homes.get(i);
                  if (!saved || !home) continue;
                  const player = players.add(i * 8).readPointer();
                  const hero = findObject(battle.readPointer(), player.add(112).readS32());
                  if (syncPlayerAlive(player, hero, tick)) {
                    state.deaths.delete(i);
                    continue;
                  }
                  if (!state.deaths.has(i)) state.deaths.set(i, tick);
                }
              }
            } catch (e) {
              state.failed = true;
              onError(new Error(`Respawn: ${String(e)}`));
            }
          }
          if (state?.hotzone && !state.failed) {
            try {
              hotzone!.update(battle, state.hotzone);
              self.lastHotZoneStatus = {
                score: [state.hotzone.match.percent(0), state.hotzone.match.percent(1)],
                zones: state.hotzone.match.zones.length,
                winner: state.hotzone.match.winner,
              };
            } catch (e) {
              state.failed = true;
              onError(new Error(`Hot Zone: ${String(e)}`));
            }
            return;
          }
          if (!state?.match || state.failed) return;
          try {
            const match = state.match,
              tick = battle.add(16).readS32();
            const players = battle.add(112).readPointer();
            const alive: [number, number] = [0, 0];
            for (let i = 0; i < 6; i++) {
              const player = players.add(i * 8).readPointer();
              const team = player.add(108).readS32();
              if (team !== 0 && team !== 1) throw new Error('Invalid Knockout team');
              const hero = findObject(battle.readPointer(), player.add(112).readS32());
              if (syncPlayerAlive(player, hero, tick)) alive[team]++;
            }
            const change = match.update(tick, alive);
            if (match.phase === 'finished' && match.winner !== null)
              results?.finishKnockout(battle.toString(), match.winner);
            if (change.respawn) {
              clearObjects(battle.readPointer());
              resetMap(battle, 6, 1);
              for (let i = 0; i < 6; i++) {
                const args = state.spawns.get(i)!;
                const hero = spawnSaved(
                  args,
                  args[8].toUInt32(),
                  args[9].toUInt32(),
                  args[10].toUInt32(),
                );
                if (hero.isNull()) throw new Error('Failed to respawn Knockout hero');
                const player = players.add(i * 8).readPointer();
                player.add(112).writeS32(hero.add(8).readS32());
                player.add(168).writeU8(1);
              }
              arrange(battle, 0, NULL, NULL, NULL, NULL);

              updatePositions(battle);
              refreshSnapshot(battle.readPointer());
            }
            if (match.phase !== 'playing') {
              for (let i = 0; i < 6; i++) {
                const player = players.add(i * 8).readPointer();
                const hero = findObject(battle.readPointer(), player.add(112).readS32());
                if (pausedBot(hero)) cancelMovement(hero, tick);
              }
            }
            const roundResults = battle.add(1080).readPointer();
            for (let i = 0; i < 3; i++) roundResults.add(i * 4).writeS32(match.results[i] ?? -1);
            battle.add(304).writeS32(match.round);
            battle.add(308).writeS32(match.elapsed(tick));
            battle.add(300).writeS32(match.remaining(tick));
            battle.add(312).writeU8(match.phase !== 'playing' ? 1 : 0);
            self.lastStatus = {
              phase: match.phase,
              round: match.round + 1,
              score: [...match.score],
              results: [...match.results],
              winner: match.winner,
              elapsedTicks: match.elapsed(tick),
            };
            if (change.roundEnded !== null)
              console.log(
                `[offline-v70] Knockout round: ${change.roundEnded}; score ${match.score.join(':')}`,
              );
          } catch (e) {
            fail(state, e);
          }
        },
      }),
    );
  }
  hotZoneStatus(): unknown {
    return this.lastHotZoneStatus;
  }
  status(): unknown {
    return this.lastStatus;
  }
}
