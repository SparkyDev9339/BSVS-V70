import { ByteStream } from '../../misc/ByteStream';

export class AuthenticationFailedMessage {
  readonly type = 20103;
  constructor(
    public reason = 'Invalid local account ID or token',
    public errorCode = 1,
  ) {}
  encode(): number[] {
    const stream = new ByteStream();
    stream.writeInt(this.errorCode);
    for (let i = 0; i < 4; i++) stream.writeString(null);
    stream.writeString(this.reason);
    stream.writeInt(0);
    stream.writeBoolean(false);
    stream.writeBytes(null);
    stream.writeInt(-1);
    stream.writeInt(0);
    stream.writeInt(0);
    stream.writeString(null);
    stream.writeInt(0);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeString(null);
    stream.writeVInt(0);
    stream.writeString(null);
    for (let i = 0; i < 8; i++) stream.writeBoolean(false);
    return stream.payload;
  }
}
