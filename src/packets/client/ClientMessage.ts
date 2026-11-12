import { ByteStream } from '../../misc/ByteStream';

export abstract class ClientMessage {
  protected trailingPayload: number[] = [];
  abstract readonly type: number;
  abstract decode(stream: ByteStream): void;
  abstract encode(stream: ByteStream): void;
  protected decodeTail(stream: ByteStream): void {
    this.trailingPayload = stream.payload.slice(stream.offset);
    stream.offset = stream.payload.length;
    stream.bitoffset = 0;
  }
  protected encodeTail(stream: ByteStream): void {
    for (const byte of this.trailingPayload) stream.writeByte(byte);
  }
  toPayload(): number[] {
    const stream = new ByteStream();
    this.encode(stream);
    return stream.payload;
  }
}
