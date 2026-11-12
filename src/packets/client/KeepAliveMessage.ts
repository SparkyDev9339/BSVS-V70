import { ByteStream } from '../../misc/ByteStream';
import { ClientMessage } from './ClientMessage';

export class KeepAliveMessage extends ClientMessage {
  readonly type = 10108;

  decode(stream: ByteStream): void {
    this.decodeTail(stream);
  }
  encode(stream: ByteStream): void {
    this.encodeTail(stream);
  }
}
