import { Config } from '../config';
import { ClientData } from './ClientData';
import { penultimatePassSeason } from '../home/BrawlPassSeasonData';

export interface InventoryRow {
  id: number;
  values: Record<string, string>;
}

export function applyInventory(
  config: Config,
  characters: readonly InventoryRow[],
  cards: readonly InventoryRow[],
): number {
  const heroes = new Map(
    characters
      .filter(row => row.values.Type === 'Hero' && row.values.Disabled !== '1')
      .map(row => [row.values.Name, row.id]),
  );
  const unlocks = new Map<number, number>();
  for (const row of cards) {
    if (row.values.Type.toLowerCase() !== 'unlock' || row.values.Disabled === '1') continue;
    const hero = heroes.get(row.values.Target);
    if (hero !== undefined) unlocks.set(hero, row.id);
  }
  if (config.autoUnlockBrawlers && !unlocks.size)
    throw new Error('No hero unlock cards found in loaded CSV tables');
  const characterIds = new Set(characters.map(row => row.id)),
    cardIds = new Set(cards.map(row => row.id));
  config.brawlers = config.brawlers.filter(b =>
    config.autoUnlockBrawlers ? unlocks.has(b.id) : characterIds.has(b.id) && cardIds.has(b.card),
  );
  for (const [id, card] of unlocks) {
    const existing = config.brawlers.find(b => b.id === id);
    if (existing) existing.card = card;
    else if (config.autoUnlockBrawlers) config.brawlers.push({ id, card, power: 11, trophies: 0 });
  }
  config.brawlers.sort((a, b) => a.id - b.id);
  if (!config.brawlers.length) throw new Error('No valid unlocked brawlers in profile');
  const fallback = config.brawlers[0].id;
  config.selectedBrawlers = config.selectedBrawlers.map(id =>
    config.brawlers.some(b => b.id === id) ? id : fallback,
  );
  if (!config.brawlers.some(b => b.id === config.favouriteBrawler))
    config.favouriteBrawler = fallback;
  return unlocks.size;
}

export function prepareInventory(base: NativePointer, config: Config): boolean {
  const data = new ClientData(base);
  const characters = data.rows(16, ['Name', 'Type', 'Disabled']);
  const cards = data.rows(23, ['Name', 'Type', 'Target', 'Disabled']);
  const seasons = config.brawlPass.enabled ? data.rows(65, ['Season']) : [];
  if (!characters || !cards || !seasons) return false;
  if (config.brawlPass.enabled) {
    config.brawlPass.season = penultimatePassSeason(seasons);
    console.log(
      `[offline-v70] Brawl Pass season ${config.brawlPass.season + 1} (wire ID ${config.brawlPass.season})`,
    );
  }
  const discovered = applyInventory(config, characters, cards);
  console.log(
    `[offline-v70] ${config.brawlers.length} brawlers; discovered ${discovered} unlock cards`,
  );
  return true;
}
