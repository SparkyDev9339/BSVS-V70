import { imageUuid } from './offsets';
import verified from '../verified-offsets-ios.json';
export function verifyImage(module: Module) {
  if (Process.platform !== 'darwin' || Process.arch !== 'arm64')
    throw new Error('Target requires iOS ARM64');
  const base = module.base;
  if (base.readU32() !== 0xfeedfacf) throw new Error('Not a Mach-O 64-bit image');
  const commands = base.add(16).readU32();
  let p = base.add(32),
    uuid = '';
  for (let i = 0; i < commands; i++) {
    const cmd = p.readU32(),
      size = p.add(4).readU32();
    if (size < 8 || size > 1024 * 1024) throw new Error('Invalid Mach-O load command');
    if (cmd === 0x1b)
      uuid = Array.from(new Uint8Array(p.add(8).readByteArray(16)!))
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
    p = p.add(size);
  }
  if (uuid !== imageUuid) throw new Error(`Unsupported client UUID ${uuid}; expected ${imageUuid}`);
  for (const [name, fn] of Object.entries(verified.functions)) {
    const actual = Array.from(new Uint8Array(base.add(parseInt(fn.rva, 16)).readByteArray(16)!))
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
    if (actual !== fn.bytes16)
      throw new Error(`Native signature mismatch: ${name}. Use an unmodified matching v70 image.`);
  }
}
