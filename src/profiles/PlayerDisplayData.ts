import { ByteStream } from '../misc/ByteStream';

export class PlayerDisplayData {
  name: string | null = null;
  experience = 100;
  thumbnail = 28000000;
  nameColor = 43000000;
  premiumNameColor = 43000000;
  flag32 = false;
  field36 = 0;
  field40 = 0;
  decode(stream: ByteStream): void {
    this.name = stream.readString();
    this.experience = stream.readVInt();
    this.thumbnail = stream.readVInt();
    this.nameColor = stream.readVInt();
    this.premiumNameColor = stream.readVInt();
    this.flag32 = stream.readBoolean();
    this.field36 = stream.readVInt();
    this.field40 = stream.readVInt();
  }
  encode(stream: ByteStream): void {
    stream.writeString(this.name);
    stream.writeVInt(this.experience);
    stream.writeVInt(this.thumbnail);
    stream.writeVInt(this.nameColor);
    stream.writeVInt(this.premiumNameColor);
    stream.writeBoolean(this.flag32);
    stream.writeVInt(this.field36);
    stream.writeVInt(this.field40);
  }
}
