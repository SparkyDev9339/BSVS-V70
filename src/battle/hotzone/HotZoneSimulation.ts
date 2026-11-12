import { nativeFunctions } from '../../offsets';
import { ClientData } from '../ClientData';
import type { OfflineBattleResults } from '../OfflineBattleResults';
import { HotZoneMatch, type ZonePlayer } from './HotZoneMatch';

type Effects = {
  area: NativePointer;
  gauges: NativePointer[];
  capture: NativePointer[];
  complete: NativePointer[];
};
export type HotZoneSession = { match: HotZoneMatch; effects: Effects[] };

export class HotZoneSimulation {
  private getTable;
  private item;
  private create;
  private position;
  private add;
  private trigger;
  private radius;
  private duration;
  private controlStart;
  private modifier;
  private find;
  private allocate;
  constructor(
    private base: NativePointer,
    private results?: OfflineBattleResults,
  ) {
    const native = nativeFunctions(base);
    this.getTable = native.table.get;
    this.item = native.table.item;
    this.create = native.hotzone.create;
    this.position = native.hotzone.position;
    this.add = native.hotzone.add;
    this.trigger = native.hotzone.trigger;
    this.radius = native.hotzone.radius;
    this.duration = native.hotzone.duration;
    this.controlStart = native.knockout.controlStart;
    this.modifier = native.hotzone.modifier;
    this.find = native.knockout.findObject;
    this.allocate = native.messaging.allocate;
  }
  private effect(
    battle: NativePointer,
    name: string,
    x: number,
    y: number,
    team: number,
    catalog: ReadonlyMap<string, number>,
  ): NativePointer {
    const id = catalog.get(name);
    if (id === undefined) throw new Error(`Missing Hot Zone effect ${name}`);
    const data = this.item(this.getTable(17), id);
    if (data.isNull()) throw new Error(`Missing Hot Zone data ${id}`);
    const area = this.create(data, NULL);
    if (area.isNull()) throw new Error('Cannot allocate Hot Zone effect');
    this.position(area, x, y, 0);
    area.add(160).writeS32(team < 0 ? -1 : 15);
    area.add(164).writeS32(team);
    area.add(168).writeS32(0);
    this.add(battle.readPointer(), area);
    this.trigger(area);
    return area;
  }
  private catalog: Map<string, number> | null = null;
  private vector(battle: NativePointer, offset: number, values: readonly number[]): void {
    const field = battle.add(offset);
    if (field.add(8).readS32() < values.length) {
      if (!field.readPointer().isNull()) throw new Error('Unexpected existing Hot Zone vector');
      const memory = this.allocate(values.length * 4);
      if (memory.isNull()) throw new Error('Cannot allocate Hot Zone scores');
      field.writePointer(memory);
      field.add(8).writeS32(values.length);
    }
    field.add(12).writeS32(values.length);
    values.forEach((value, i) =>
      field
        .readPointer()
        .add(i * 4)
        .writeS32(value),
    );
  }
  initialize(battle: NativePointer): HotZoneSession {
    const rows = new ClientData(this.base).rows(17, ['Name']);
    if (!rows) throw new Error('Area effects are not loaded');
    this.catalog = new Map(rows.map(row => [row.values.Name, row.id]));
    for (const name of [
      'KingOfHillArea',
      'KingOfHillAreaGauge',
      'KingOfHillAreaCapture',
      'KingOfHillAreaComplete',
    ])
      if (!this.catalog.has(name)) throw new Error(`Missing Hot Zone effect ${name}`);
    const map = battle.add(104).readPointer(),
      layout = map.add(120).readPointer();
    const width = map.add(212).readS32(),
      height = map.add(216).readS32();
    const count = layout.add(36).readS32(),
      cells = layout.add(24).readPointer();
    if (width < 1 || height < 1 || width * height !== count || count > 20000)
      throw new Error('Invalid Hot Zone map');
    const markers: number[] = [];
    for (let i = 0; i < count; i++) if (cells.add(i * 4).readS32() === 56) markers.push(i);
    if (!markers.length || markers.length > 3)
      throw new Error('Hot Zone requires 1..3 zone markers');
    if (battle.add(916).readS32() !== 0) throw new Error('Hot Zone already initialized');
    const effects = markers.map(index => {
      const x = (index % width) * 300 + 150,
        y = Math.floor(index / width) * 300 + 150;
      return {
        area: this.effect(battle, 'KingOfHillArea', x, y, -1, this.catalog!),
        gauges: [0, 1].map(team =>
          this.effect(battle, 'KingOfHillAreaGauge', x, y, team, this.catalog!),
        ),
        capture: [NULL, NULL],
        complete: [NULL, NULL],
      };
    });
    this.vector(battle, 856, markers);
    this.vector(
      battle,
      904,
      effects.map(e => e.area.add(8).readS32()),
    );
    this.vector(
      battle,
      920,
      markers.map(() => 0),
    );
    this.vector(
      battle,
      936,
      markers.map(() => 0),
    );
    this.vector(
      battle,
      968,
      markers.map(() => 0),
    );
    const match = new HotZoneMatch(
      effects.map(e => ({
        x: e.area.add(56).readS32(),
        y: e.area.add(60).readS32(),
        radius: this.radius(e.area),
      })),
      this.controlStart(battle),
      this.duration(battle.add(224).readPointer()) - 1,
    );
    console.log(
      `[offline-v70] Hot Zone: ${effects.length} zones, ${match.zoneTarget} points per zone`,
    );
    return { match, effects };
  }
  update(battle: NativePointer, state: HotZoneSession): void {
    const { match, effects } = state,
      players: ZonePlayer[] = [];
    const count = battle.add(96).readS32(),
      roster = battle.add(112).readPointer();
    if (count < 1 || count > 10) throw new Error('Invalid Hot Zone roster');
    for (let i = 0; i < count; i++) {
      const player = roster.add(i * 8).readPointer(),
        hero = this.find(battle.readPointer(), player.add(112).readS32());
      if (hero.isNull()) continue;
      players.push({
        team: player.add(108).readS32(),
        x: hero.add(56).readS32(),
        y: hero.add(60).readS32(),
        z: hero.add(64).readS32(),
        alive: hero.add(1404).readS32() > 0,
        inRealm: hero.add(168).readS32() !== 0,
      });
    }
    match.update(battle.add(16).readS32(), players, !!this.modifier(battle, 37));
    for (const team of [0, 1]) {
      this.vector(
        battle,
        team === 0 ? 936 : 968,
        effects.map((_, i) => match.zoneScore(i, team)),
      );

      effects.forEach((effect, i) => {
        const zone = match.zones[i],
          completed = match.zoneScore(i, team) === match.zoneTarget;
        const capturing = match.winner === null && match.occupied[i][team] && !completed;
        if (capturing && effect.capture[team].isNull())
          effect.capture[team] = this.effect(
            battle,
            'KingOfHillAreaCapture',
            zone.x,
            zone.y,
            team,
            this.catalog!,
          );
        if (!capturing && !effect.capture[team].isNull()) {
          effect.capture[team].add(412).writeU8(1);
          effect.capture[team] = NULL;
        }
        if (!effect.gauges[team].isNull())
          effect.gauges[team].add(328).writeS32(match.zonePercent(i, team));
        if (completed && effect.complete[team].isNull()) {
          effect.gauges[team].add(412).writeU8(1);
          effect.gauges[team] = NULL;
          effect.complete[team] = this.effect(
            battle,
            'KingOfHillAreaComplete',
            zone.x,
            zone.y,
            team,
            this.catalog!,
          );
        }
      });
    }
    if (match.winner !== null) {
      battle.add(272).writeS32(match.winner);
      this.results?.finishTeamMatch(battle.toString(), 17, match.winner);
    }
  }
}
