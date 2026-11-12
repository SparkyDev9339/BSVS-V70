import { ByteStream } from '../../misc/ByteStream';
import { ClientMessage } from './ClientMessage';

export class GoHomeMessage extends ClientMessage {
  readonly type = 14101;

  decode(stream: ByteStream): void {
    this.decodeTail(stream);
  }
  encode(stream: ByteStream): void {
    this.encodeTail(stream);
  }
}
