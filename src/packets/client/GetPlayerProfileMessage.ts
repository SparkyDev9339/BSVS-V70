import { ByteStream } from '../../misc/ByteStream';
import { ProfileQueryContext } from '../../profiles/ProfileQueryContext';
import { ClientMessage } from './ClientMessage';

export class GetPlayerProfileMessage extends ClientMessage {
  readonly type = 15081;
  context: number[] | null = null;
  requestType = 0;
  accountId: [number, number] = [0, 0];
  profileContext: ProfileQueryContext | null = null;
  decode(stream: ByteStream): void {
    this.context = stream.readBoolean()
      ? Array.from({ length: 12 }, () => stream.readVInt())
      : null;
    this.requestType = stream.readVInt();
    this.accountId = stream.readLong();
    this.profileContext = null;
    if (stream.readBoolean()) {
      this.profileContext = new ProfileQueryContext();
      this.profileContext.decode(stream);
    }
    this.decodeTail(stream);
  }
  encode(stream: ByteStream): void {
    if (this.context && this.context.length !== 12)
      throw new Error('Profile request context must contain 12 VInts');
    stream.writeBoolean(this.context !== null);
    if (this.context) this.context.forEach(value => stream.writeVInt(value));
    stream.writeVInt(this.requestType);
    stream.writeLong(...this.accountId);
    stream.writeBoolean(this.profileContext !== null);
    if (this.profileContext) this.profileContext.encode(stream);
    this.encodeTail(stream);
  }
}
