import { ByteStream } from '../../misc/ByteStream';
import { ClientMessage } from './ClientMessage';

export class GoHomeFromMapEditorMessage extends ClientMessage {
  readonly type = 12108;

  decode(stream: ByteStream): void {
    this.decodeTail(stream);
  }
  encode(stream: ByteStream): void {
    this.encodeTail(stream);
  }
}
