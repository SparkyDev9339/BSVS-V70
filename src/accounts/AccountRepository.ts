import { Config, defaultConfig, validateConfig } from '../config';

export type AccountId = [number, number];
export interface Account {
  token: string;
  createdAt: number;
  profile: Config;
}
export interface AccountDatabase {
  format: 2;
  nameStateVersion?: 1;
  activeAccount: string;
  accounts: Record<string, Account>;
}
export function accountKey(id: readonly number[]): string {
  if (id.length !== 2 || !id.every(n => Number.isInteger(n) && n >= 0 && n <= 2147483647))
    throw new Error('Invalid account ID');
  return `${id[0]}:${id[1]}`;
}
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const validToken = (token: unknown): token is string =>
  typeof token === 'string' && /^[0-9a-f]{64}$/.test(token);

function readDatabase(data: AccountDatabase): AccountDatabase {
  if (
    data.format !== 2 ||
    !data.accounts ||
    typeof data.accounts !== 'object' ||
    Array.isArray(data.accounts)
  )
    throw new Error('Invalid account database');
  if (data.nameStateVersion !== undefined && data.nameStateVersion !== 1)
    throw new Error('Invalid name state version');
  const entries = Object.entries(data.accounts);
  if (!entries.length || entries.length > 1000) throw new Error('Invalid account count');
  const accounts: Record<string, Account> = {};
  const tokens = new Set<string>();
  for (const [key, account] of entries) {
    if (!account || !validToken(account.token) || tokens.has(account.token))
      throw new Error('Invalid account token');
    const profile = validateConfig(account.profile);

    if (data.nameStateVersion === undefined && profile.name === 'Offline-v70')
      profile.registered = false;
    if (
      key !== accountKey(profile.id) ||
      key === '0:0' ||
      !Number.isSafeInteger(account.createdAt) ||
      account.createdAt < 0
    )
      throw new Error('Invalid account record');
    tokens.add(account.token);
    accounts[key] = { token: account.token, createdAt: account.createdAt, profile };
  }
  if (!Object.hasOwn(accounts, data.activeAccount)) throw new Error('Active account not found');
  return { format: 2, nameStateVersion: 1, activeAccount: data.activeAccount, accounts };
}

export class AccountRepository {
  private database: AccountDatabase;
  config: Config;
  constructor(
    data: unknown,
    private readonly persist: (database: AccountDatabase) => void,
    private readonly makeToken: () => string,
    private readonly now: () => number = Date.now,
  ) {
    if (data && typeof data === 'object' && 'format' in data) {
      const db = data as AccountDatabase;
      this.database = readDatabase(db);
      if (db.nameStateVersion === undefined) this.persist(clone(this.database));
    } else {
      this.database = this.bootstrap(data);
      this.persist(clone(this.database));
    }
    this.config = clone(this.database.accounts[this.database.activeAccount].profile);
  }
  private bootstrap(data: unknown): AccountDatabase {
    const profile = data === null ? defaultConfig() : validateConfig(data);
    if (profile.name === 'Offline-v70') profile.registered = false;
    const key = accountKey(profile.id);
    if (key === '0:0') throw new Error('Saved account ID cannot be zero');
    return {
      format: 2,
      nameStateVersion: 1,
      activeAccount: key,
      accounts: { [key]: { token: this.newToken(), createdAt: this.now(), profile } },
    };
  }
  private newToken(): string {
    const token = this.makeToken();
    if (!validToken(token)) throw new Error('Token generator must supply 32 random bytes');
    return token;
  }
  get token(): string {
    return this.database.accounts[this.database.activeAccount].token;
  }
  private commit(database: AccountDatabase) {
    this.persist(clone(database));
    this.database = database;
    this.config = clone(database.accounts[database.activeAccount].profile);
  }
  save(): void {
    const profile = validateConfig(this.config);
    if (accountKey(profile.id) !== this.database.activeAccount)
      throw new Error('Cannot change the active account ID');
    const next = clone(this.database);
    next.accounts[next.activeAccount].profile = profile;
    this.commit(next);
  }
  create(name?: string): AccountId {
    if (Object.keys(this.database.accounts).length >= 1000)
      throw new Error('Local account limit reached');
    const ids = Object.values(this.database.accounts).map(a => a.profile.id);
    ids.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    let [high, low] = ids[ids.length - 1];
    if (low === 2147483647) {
      high++;
      low = 0;
    } else low++;
    const id: AccountId = [high, low];
    accountKey(id);
    const profile = defaultConfig();
    profile.id = id;
    profile.name = name ?? 'Player';
    profile.registered = !!name;
    const validated = validateConfig(profile);
    const token = this.newToken();
    if (Object.values(this.database.accounts).some(a => a.token === token))
      throw new Error('Duplicate generated token');
    const next = clone(this.database);

    const current = validateConfig(this.config);
    if (accountKey(current.id) !== next.activeAccount)
      throw new Error('Cannot change the active account ID');
    next.accounts[next.activeAccount].profile = current;
    next.activeAccount = accountKey(id);
    next.accounts[next.activeAccount] = { token, createdAt: this.now(), profile: validated };
    this.commit(next);
    return id;
  }
  select(id: readonly number[]): boolean {
    const key = accountKey(id);
    if (!Object.hasOwn(this.database.accounts, key)) return false;
    this.save();
    const next = clone(this.database);
    next.activeAccount = key;
    this.commit(next);
    return true;
  }
  authenticate(id: readonly number[], token: string | null): boolean {
    const key = accountKey(id);
    if (key === '0:0' && !token) {
      this.create();
      return true;
    }
    const account = this.database.accounts[key];
    return !!account && token === account.token && this.select(id);
  }
  getProfile(id: readonly number[]): Config | null {
    const key = accountKey(id);
    if (key === this.database.activeAccount) return validateConfig(this.config);
    const account = this.database.accounts[key];
    return account ? clone(account.profile) : null;
  }
  list() {
    return Object.entries(this.database.accounts).map(([key, account]) => {
      const profile = key === this.database.activeAccount ? this.config : account.profile;
      return {
        id: [...profile.id],
        name: profile.name,
        createdAt: account.createdAt,
        active: key === this.database.activeAccount,
      };
    });
  }
}
