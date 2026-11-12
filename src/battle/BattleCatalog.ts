import type { SelectionCatalog } from '../Commands/LogicCommand';
import type { ClientRow } from './ClientData';

const duoModes = new Set([
  'DuoShowdown',
  'TrioShowdown',
  'TrioShowdownLimbo',
  'DuoShowdownPlus',
  'LoadedDuoShowdown',
]);

function resultMode(name: string): number {
  if (name === 'Tutorial') return 0;
  if (name === 'Showdown') return 2;
  if (duoModes.has(name)) return 5;
  if (name === 'Duels') return 7;
  return 1;
}

export function battleLocationMaps(
  locations: readonly ClientRow[],
  modes: readonly ClientRow[],
): { variations: Map<number, number>; resultModes: Map<number, number> } {
  const byName = new Map(modes.map(row => [row.values.Name, Number(row.values.Variation)]));
  const variations = new Map<number, number>();
  const resultModes = new Map<number, number>();
  for (const location of locations) {
    const name = location.values.GameModeVariation;
    const variation = byName.get(name);
    if (
      variation !== undefined &&
      Number.isInteger(variation) &&
      variation >= 0 &&
      variation <= 90
    ) {
      variations.set(location.id, variation);
    }
    resultModes.set(location.id, resultMode(name));
  }
  return { variations, resultModes };
}

export function selectionCatalog(
  skins: readonly ClientRow[],
  skinConfs: readonly ClientRow[],
  characters: readonly ClientRow[],
  thumbnails: readonly ClientRow[],
  nameColors: readonly ClientRow[],
  ownedSkinIds: readonly number[],
): SelectionCatalog {
  const heroesByName = new Map(characters.map(row => [row.values.Name, row.id]));
  const heroesByConf = new Map(
    skinConfs.map(row => [row.values.Name, heroesByName.get(row.values.Character)]),
  );
  const owned = new Set(ownedSkinIds);
  const eligible = (rows: readonly ClientRow[]): Set<number> =>
    new Set(rows.filter(row => row.values.Disabled !== '1').map(row => row.id));
  const skinHeroes = new Map<number, number>();
  for (const skin of skins) {
    const hero = heroesByConf.get(skin.values.Conf);
    if (owned.has(skin.id) && hero !== undefined) skinHeroes.set(skin.id, hero);
  }
  return {
    skins: skinHeroes,
    thumbnails: eligible(thumbnails),
    nameColors: eligible(nameColors),
  };
}
