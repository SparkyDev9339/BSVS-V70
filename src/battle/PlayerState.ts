export function syncPlayerAlive(
  player: NativePointer,
  hero: NativePointer,
  _tick: number,
): boolean {
  const alive = !hero.isNull() && hero.add(1404).readS32() > 0;
  player.add(168).writeU8(alive ? 1 : 0);
  return alive;
}
