import { ByteStream } from '../../misc/ByteStream';

export class AvatarNameCheckResponseMessage {
  readonly type = 20300;
  constructor(public name: string | null = null) {}
  encode(): number[] {
    const stream = new ByteStream();
    const invalid = !this.name || !this.name.trim() || this.name.length > 32;
    stream.writeBoolean(invalid);
    stream.writeInt(invalid ? 1 : 0);
    stream.writeString(this.name);
    return stream.payload;
  }
}
