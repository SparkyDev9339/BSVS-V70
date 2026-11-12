import { nativeFunctions, platformOffsets } from '../../offsets';

const character = {
  moveStart: 40,
  moveEnd: 44,
  x: 56,
  y: 60,
  health: 1404,
  pathLength: 1492,
  charging: 1652,
  chargeType: 1768,
  chargeSpeed: 1804,
} as const;

const skillField = {
  chargeType: 536,
  castingTime: 556,
  chargeSpeed: 692,
  behavior: 712,
} as const;

const duration = (length: number, speed: number): number =>
  Math.max(1, Math.trunc((20 * length) / speed));

function hasNewPath(hero: NativePointer, tick: number): boolean {
  return (
    hero.add(character.pathLength).readS32() > 0 &&
    hero.add(character.moveStart).readS32() === tick &&
    hero.add(character.moveEnd).readS32() > tick
  );
}

function applyChargeState(hero: NativePointer, type: number, speed: number): void {
  hero.add(character.chargeSpeed).writeS32(speed);
  hero.add(character.chargeType).writeS32(type);
  hero.add(character.charging).writeU8(1);
}

type PendingCharge = {
  battle: NativePointer;
  hero: NativePointer;
  due: number;
  x: number;
  y: number;
  originX: number;
  originY: number;
  speed: number;
  type: number;
};

type ActiveCharge = Pick<
  PendingCharge,
  'battle' | 'hero' | 'originX' | 'originY' | 'type' | 'speed'
> & {
  end: number;
  returning: boolean;
};

function chargeTravelSpeed(type: number, speed: number): number {
  if (type === 16) return Math.max(1, Math.trunc(speed * 0.8));
  if (type === 18 || type === 19) return Math.max(1, Math.trunc(speed * 0.7));
  return speed;
}

function chargeTravelLength(type: number, pathLength: number): number {
  return type === 2 || type === 6 || type === 11 ? 2300 : pathLength;
}

export function installChargeMovement(base: NativePointer): InvocationListener[] {
  const native = nativeFunctions(base);
  const pending = new Map<string, PendingCharge>();
  const active = new Map<string, ActiveCharge>();
  const setPath = native.charge.setPath;
  const directPath = native.charge.directPath;
  const pathLength = native.charge.pathLength;
  const destroyEnvironment = native.charge.destroyEnvironment;
  const wallFailed = new Set<string>();
  const breakBullWalls = (battle: NativePointer, hero: NativePointer): void => {
    const key = battle.toString();
    if (wallFailed.has(key)) return;
    const map = battle.add(104).readPointer();
    if (map.isNull()) return;
    const width = map.add(212).readS32(),
      height = map.add(216).readS32();
    if (width < 3 || width > 100 || height < 3 || height > 100) return;
    const x = hero.add(56).readS32(),
      y = hero.add(60).readS32();
    try {
      destroyEnvironment(
        map,
        x,
        y,
        400,
        0,
        hero.add(160).readS32(),
        hero.add(164).readS32(),
        0,
        0,
        hero.add(32).readPointer(),
      );
    } catch (error) {
      wallFailed.add(key);
      console.error(`[offline-v70] Bull wall destruction disabled: ${String(error)}`);
    }
  };
  const startNativePath = (
    hero: NativePointer,
    x: number,
    y: number,
    tick: number,
    speed: number,
    type: number,
  ): boolean => {
    setPath(hero, x, y, 1, speed, 0, 0);
    if (!hasNewPath(hero, tick)) return false;
    const length = hero.add(character.pathLength).readS32();
    hero.add(character.moveEnd).writeS32(tick + duration(chargeTravelLength(type, length), speed));
    return true;
  };
  let logged = 0;
  const activation = Interceptor.attach(base.add(platformOffsets.charge.activateSkill), {
    onEnter(args) {
      this.charge = false;
      if (args[0].isNull() || args[1].isNull() || args[1].add(skillField.behavior).readS32() !== 2)
        return;
      const hero = args[0],
        manager = hero.add(32).readPointer();
      if (manager.isNull()) return;
      const battle = manager.add(296).readPointer();
      if (battle.isNull() || battle.add(240).readU8() !== 1) return;
      this.charge = true;
      this.hero = hero;
      this.skill = args[1];
      this.battle = battle;
      this.x = args[2].toInt32();
      this.y = args[3].toInt32();
      this.originX = hero.add(56).readS32();
      this.originY = hero.add(60).readS32();
    },
    onLeave(retval) {
      if (!this.charge) return;
      const hero = this.hero as NativePointer,
        skill = this.skill as NativePointer;
      const result = retval.toInt32(),
        type = skill.add(skillField.chargeType).readS32();
      if (logged++ < 32)
        console.log(
          `[offline-v70] Charge id=${hero.add(8).readS32()} type=${type}` +
            ` result=${result} control=${hero.add(3020).readU8()}` +
            ` flags=${hero.add(1652).readU8()},${hero.add(1653).readU8()}` +
            ` lock=${hero.add(1616).readS32()},${hero.add(1620).readS32()}`,
        );
      if (result !== 1 || type === 9 || type < 0 || type > 31) return;
      const speed = skill.add(skillField.chargeSpeed).readS32();
      if (speed <= 0 || speed > 50000) return;
      const battle = this.battle as NativePointer;
      const castingMs = Math.max(0, skill.add(skillField.castingTime).readS32());
      pending.set(hero.toString(), {
        battle,
        hero,
        type,
        speed,
        due: battle.add(16).readS32() + Math.max(1, Math.ceil(castingMs / 50)),
        x: this.x as number,
        y: this.y as number,
        originX: this.originX as number,
        originY: this.originY as number,
      });
    },
  });
  const tick = Interceptor.attach(base.add(platformOffsets.knockout.step), {
    onEnter(args) {
      const battle = args[0],
        now = battle.add(16).readS32();
      for (const [key, charge] of active) {
        if (!charge.battle.equals(battle)) continue;
        if (now < charge.end && charge.hero.add(1404).readS32() > 0) {
          if (charge.type === 1) breakBullWalls(battle, charge.hero);
          continue;
        }
        if (charge.type === 10 && !charge.returning && charge.hero.add(1404).readS32() > 0) {
          if (
            startNativePath(
              charge.hero,
              charge.originX,
              charge.originY,
              now,
              charge.speed,
              charge.type,
            )
          ) {
            charge.end = charge.hero.add(character.moveEnd).readS32();
            applyChargeState(charge.hero, charge.type, charge.speed);
            charge.returning = true;
            continue;
          }
        }

        if (charge.hero.add(1652).readU8() === 1 && charge.hero.add(1768).readS32() === charge.type)
          charge.hero.add(1652).writeU8(0);
        active.delete(key);
      }
      for (const [key, charge] of pending) {
        if (!charge.battle.equals(battle)) continue;
        if (now < charge.due) continue;
        pending.delete(key);
        const { hero, x, y, originX, originY, type } = charge;
        const speed = chargeTravelSpeed(type, charge.speed);
        if (hero.add(1404).readS32() <= 0 || hero.add(1652).readU8() === 1) continue;
        const targetX = hero.add(56).readS32() + x - originX;
        const targetY = hero.add(60).readS32() + y - originY;
        if (x === originX && y === originY) continue;
        let pathReady = false;
        if (type === 1) {
          const map = battle.add(104).readPointer();
          if (!map.isNull()) {
            directPath(hero, targetX, targetY, map);
            const length = pathLength(hero.add(1344), hero.add(1360));
            if (length > 0) {
              pathReady = true;
              hero.add(1492).writeS32(length);
              hero.add(40).writeS32(now);
              hero.add(character.moveEnd).writeS32(now + duration(length, speed));
              hero.add(1500).writeS32(0);
              hero.add(1504).writeS32(0);
              hero.add(1508).writeS32(0);
              hero.add(1516).writeU8(0);
              breakBullWalls(battle, hero);
            }
          }
        } else {
          pathReady = startNativePath(hero, targetX, targetY, now, speed, type);
        }
        if (!pathReady) continue;
        const end = hero.add(character.moveEnd).readS32();
        if (end > now && hero.add(character.pathLength).readS32() > 0) {
          applyChargeState(hero, type, speed);
          active.set(key, { battle, hero, end, type, speed, originX, originY, returning: false });
        }
        if (logged < 40)
          console.log(
            `[offline-v70] Charge path id=${hero.add(8).readS32()} type=${type}` +
              ` length=${hero.add(1492).readS32()} ticks=${end - now}` +
              ` aim=${targetX},${targetY}`,
          );
      }
    },
  });
  const destroy = Interceptor.attach(base.add(platformOffsets.knockout.destructor), {
    onEnter(args) {
      const battle = args[0];
      for (const [key, charge] of pending) if (charge.battle.equals(battle)) pending.delete(key);
      for (const [key, charge] of active) if (charge.battle.equals(battle)) active.delete(key);
      wallFailed.delete(battle.toString());
    },
  });
  return [activation, tick, destroy];
}
