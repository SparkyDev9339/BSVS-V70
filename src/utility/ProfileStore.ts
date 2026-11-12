import { AccountDatabase, AccountRepository } from '../accounts/AccountRepository';

export class ProfileStore extends AccountRepository {
  readonly path: string;
  constructor() {
    const libc = Process.getModuleByName('libSystem.B.dylib');
    const getenv = new NativeFunction(libc.getExportByName('getenv'), 'pointer', ['pointer']);
    const home = getenv(Memory.allocUtf8String('HOME')).readUtf8String();
    if (!home) throw new Error('Cannot resolve application HOME');
    const path = home + '/Documents/offline-v70-profile.json';
    const rename = new NativeFunction(libc.getExportByName('rename'), 'int', [
      'pointer',
      'pointer',
    ]);
    const access = new NativeFunction(libc.getExportByName('access'), 'int', ['pointer', 'int']);
    const random = new NativeFunction(libc.getExportByName('arc4random_buf'), 'void', [
      'pointer',
      'ulong',
    ]);
    const persist = (database: AccountDatabase) => {
      File.writeAllText(path + '.tmp', JSON.stringify(database, null, 2));
      if (rename(Memory.allocUtf8String(path + '.tmp'), Memory.allocUtf8String(path)) !== 0)
        throw new Error('Cannot atomically save accounts');
    };
    const makeToken = () => {
      const bytes = Memory.alloc(32);
      random(bytes, 32);
      return Array.from(new Uint8Array(bytes.readByteArray(32)!))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    };
    const data: unknown =
      access(Memory.allocUtf8String(path), 0) === 0 ? JSON.parse(File.readAllText(path)) : null;
    super(data, persist, makeToken);
    this.path = path;
  }
}
