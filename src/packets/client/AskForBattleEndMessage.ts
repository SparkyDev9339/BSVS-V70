import { ByteStream } from '../../misc/ByteStream';
import { ClientBattlePlayer } from '../../battle/ClientBattlePlayer';
import { ClientMessage } from './ClientMessage';

export class AskForBattleEndMessage extends ClientMessage {
  readonly type = 14110;
  battleResult = 0;
  rank = 0;
  field152 = 0;
  location: [number, number] = [0, 0];
  players: ClientBattlePlayer[] = [];
  decode(stream: ByteStream): void {
    this.battleResult = stream.readVInt();
    this.rank = stream.readVInt();
    this.field152 = stream.readVInt();
    this.location = stream.readDataReference();
    const count = stream.readVInt();
    if (count < 0 || count > 100) throw new Error('Invalid battle player count');
    this.players = [];
    for (let i = 0; i < count; i++) {
      const player = new ClientBattlePlayer();
      player.decode(stream);
      this.players.push(player);
    }
    this.decodeTail(stream);
  }
  encode(stream: ByteStream): void {
    if (this.players.length > 100) throw new Error('Invalid battle player count');
    stream.writeVInt(this.battleResult);
    stream.writeVInt(this.rank);
    stream.writeVInt(this.field152);
    stream.writeDataReference(...this.location);
    stream.writeVInt(this.players.length);
    for (const player of this.players) player.encode(stream);
    this.encodeTail(stream);
  }
}
