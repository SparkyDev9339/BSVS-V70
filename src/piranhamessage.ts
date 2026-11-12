import { offsets, layout } from './offsets';
const L = layout;
export class PiranhaMessage {
  static type(message: NativePointer): number {
    return new NativeFunction(message.readPointer().add(L.messageType).readPointer(), 'int', [
      'pointer',
    ])(message);
  }
  static payload(message: NativePointer): number[] {
    new NativeFunction(message.readPointer().add(L.encode).readPointer(), 'void', ['pointer'])(
      message,
    );
    const stream = message.add(L.byteStream);
    const size = Math.max(stream.add(L.streamOffset).readS32(), stream.add(L.streamSize).readS32());
    if (size < 0 || size > 1024 * 1024) throw new Error(`Invalid encoded message size ${size}`);
    return size
      ? Array.from(new Uint8Array(stream.add(L.streamBuffer).readPointer().readByteArray(size)!))
      : [];
  }
  static destroy(message: NativePointer) {
    const vtable = message.readPointer();
    new NativeFunction(vtable.add(L.destruct).readPointer(), 'void', ['pointer'])(message);
    new NativeFunction(vtable.add(L.delete).readPointer(), 'void', ['pointer'])(message);
  }
}
