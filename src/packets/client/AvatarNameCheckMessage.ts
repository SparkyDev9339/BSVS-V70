import { ByteStream } from '../../misc/ByteStream';
import { ClientMessage } from './ClientMessage';

export class AvatarNameCheckMessage extends ClientMessage {
  readonly type = 14600;
  name: string | null = null;
  decode(stream: ByteStream): void {
    this.name = stream.readString();
    this.decodeTail(stream);
  }
  encode(stream: ByteStream): void {
    stream.writeString(this.name);
    this.encodeTail(stream);
  }
}
