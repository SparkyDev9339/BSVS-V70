import type { InventoryRow } from './Inventory';

const enabled = (row: InventoryRow) => !['1', 'true'].includes(row.values.Disabled?.toLowerCase());

export function unlockedSkins(
  skins: readonly InventoryRow[],
  confs: readonly InventoryRow[],
  characters: readonly InventoryRow[],
): number[] {
  const heroes = new Set(
    characters
      .filter(row => enabled(row) && row.values.Type === 'Hero')
      .map(row => row.values.Name),
  );
  const playable = new Set(
    confs.filter(row => heroes.has(row.values.Character)).map(row => row.values.Name),
  );
  const ordinary: number[] = [];
  const progression = new Map<string, InventoryRow>();
  for (const skin of skins) {
    if (!enabled(skin) || !playable.has(skin.values.Conf)) continue;
    const base = skin.values.ProgressionSkinBase;
    if (!base) {
      ordinary.push(skin.id);
      continue;
    }
    const level = Number(skin.values.ProgressionSkinLevel);
    if (!Number.isInteger(level) || level < 0) continue;
    const previous = progression.get(base);
    if (
      !previous ||
      level > Number(previous.values.ProgressionSkinLevel) ||
      (level === Number(previous.values.ProgressionSkinLevel) && skin.id < previous.id)
    )
      progression.set(base, skin);
  }
  return [...new Set([...ordinary, ...Array.from(progression.values(), row => row.id)])].sort(
    (a, b) => a - b,
  );
}
