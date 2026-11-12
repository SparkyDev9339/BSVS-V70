import { ByteStream } from '../../misc/ByteStream';
import { ClientMessage } from './ClientMessage';

export class SetSupportedCreatorMessage extends ClientMessage {
  readonly type = 18686;
  code: string | null = null;
  decode(stream: ByteStream): void {
    this.code = stream.readString();
    this.decodeTail(stream);
  }
  encode(stream: ByteStream): void {
    stream.writeString(this.code);
    this.encodeTail(stream);
  }
}
