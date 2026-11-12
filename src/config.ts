import defaults from '../config/config.json';
export type Config = Omit<
  typeof defaults,
  'selectedSkins' | 'skinRandomizer' | 'currentRandomSkins'
> & {
  selectedSkins: number[];
  skinRandomizer: number[];
  currentRandomSkins: number[];
};
export function validateConfig(value: unknown): Config {
  if (!value || typeof value !== 'object') throw new Error('Profile must be an object');
  const c = { ...defaults, ...value } as Config;
  const integer = (n: unknown, max = 2147483647): n is number =>
    Number.isInteger(n) && Number(n) >= 0 && Number(n) <= max;
  if (!Array.isArray(c.id) || c.id.length !== 2 || !c.id.every(n => integer(n)))
    throw new Error('Invalid account ID');
  if (typeof c.name !== 'string' || !c.name.trim() || c.name.length > 32)
    throw new Error('Invalid player name');
  for (const key of ['country', 'creator'] as const)
    if (typeof c[key] !== 'string' || c[key].length > 64) throw new Error(`Invalid ${key}`);
  for (const key of [
    'thumbnail',
    'nameColor',
    'favouriteBrawler',
    'gems',
    'coins',
    'bling',
  ] as const)
    if (!integer(c[key])) throw new Error(`Invalid ${key}`);
  if (!integer(c.sendDelayMs, 60000)) throw new Error('Invalid sendDelayMs');
  if (
    !c.brawlPass ||
    typeof c.brawlPass.enabled !== 'boolean' ||
    typeof c.brawlPass.premium !== 'boolean' ||
    !integer(c.brawlPass.season) ||
    !integer(c.brawlPass.points)
  )
    throw new Error('Invalid Brawl Pass settings');
  for (const key of ['selectedSkins', 'skinRandomizer', 'currentRandomSkins'] as const) {
    if (
      !Array.isArray(c[key]) ||
      c[key].length > 20000 ||
      !c[key].every(n => integer(n, 999999)) ||
      new Set(c[key]).size !== c[key].length
    )
      throw new Error(`Invalid ${key}`);
  }
  if (
    !Array.isArray(c.selectedBrawlers) ||
    c.selectedBrawlers.length !== 3 ||
    !c.selectedBrawlers.every(n => integer(n, 999999))
  )
    throw new Error('Invalid selected brawlers');
  if (
    !Array.isArray(c.brawlers) ||
    c.brawlers.length > 1000 ||
    !c.brawlers.every(
      b =>
        b &&
        integer(b.id, 999999) &&
        integer(b.card, 999999) &&
        integer(b.power, 11) &&
        b.power >= 1 &&
        integer(b.trophies),
    )
  )
    throw new Error('Invalid brawler inventory');
  if (new Set(c.brawlers.map(b => b.id)).size !== c.brawlers.length)
    throw new Error('Duplicate brawler');
  if (
    typeof c.registered !== 'boolean' ||
    typeof c.verbose !== 'boolean' ||
    typeof c.autoUnlockBrawlers !== 'boolean'
  )
    throw new Error('Invalid profile flags');
  return JSON.parse(JSON.stringify(c)) as Config;
}
export const defaultConfig = (): Config => validateConfig(defaults);
