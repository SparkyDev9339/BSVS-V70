import { ByteStream } from '../misc/ByteStream';

export class ClientBattlePlayer {
  character: [number, number] = [0, 0];
  skin: [number, number] = [0, 0];
  teamIndex = 0;

  isPlayer = false;
  name: string | null = null;
  decode(stream: ByteStream): void {
    this.character = stream.readDataReference();
    this.skin = stream.readDataReference();
    this.teamIndex = stream.readVInt();
    this.isPlayer = stream.readBoolean();
    this.name = stream.readString();
  }
  encode(stream: ByteStream): void {
    stream.writeDataReference(...this.character);
    stream.writeDataReference(...this.skin);
    stream.writeVInt(this.teamIndex);
    stream.writeBoolean(this.isPlayer);
    stream.writeString(this.name);
  }
}
