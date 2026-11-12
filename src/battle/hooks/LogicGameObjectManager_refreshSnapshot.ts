import { nativeFunctions } from '../../offsets';

export function createSnapshotRefresh(base: NativePointer) {
  const append = nativeFunctions(base).knockout.appendPointer;
  const scratch = Memory.alloc(Process.pointerSize);
  function refreshSnapshot(manager: NativePointer) {
    const count = manager.add(12).readS32(),
      objects = manager.readPointer();
    if (count < 0 || count > 20000) throw new Error('Invalid object count');
    manager.add(241).writeU8(0);
    manager.add(28).writeS32(0);
    for (let i = 0; i < count; i++) {
      scratch.writePointer(objects.add(i * Process.pointerSize).readPointer());
      append(manager.add(16), scratch);
    }
  }
  return refreshSnapshot;
}
