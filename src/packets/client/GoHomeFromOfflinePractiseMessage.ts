import { ByteStream } from '../../misc/ByteStream';
import { ClientMessage } from './ClientMessage';

export class GoHomeFromOfflinePractiseMessage extends ClientMessage {
  readonly type = 17750;
  flag144 = false;
  decode(stream: ByteStream): void {
    this.flag144 = stream.readBoolean();
    this.decodeTail(stream);
  }
  encode(stream: ByteStream): void {
    stream.writeBoolean(this.flag144);
    this.encodeTail(stream);
  }
}
