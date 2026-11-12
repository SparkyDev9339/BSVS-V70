import { platformOffsets } from '../../offsets';

export function cancelMovement(hero: NativePointer, tick: number): void {
  hero.add(40).writeS32(tick);
  hero.add(44).writeS32(tick);
  hero.add(1492).writeS32(0);
  hero.add(1500).writeS32(0);
  hero.add(1504).writeS32(0);
  hero.add(1508).writeS32(0);
  hero.add(1516).writeU8(0);
  hero.add(3264).writeS32(0);
}

export function replaceCalculateMovement(
  base: NativePointer,
  paused: (hero: NativePointer) => boolean,
) {
  const address = base.add(platformOffsets.knockout.calculateMovement);
  return Interceptor.attach(address, {
    onEnter(args) {
      if (paused(args[0])) cancelMovement(args[0], args[1].toInt32());
    },
  });
}
