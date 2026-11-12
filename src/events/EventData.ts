import { ByteStream } from '../misc/ByteStream';

export class EventData {
  constructor(
    readonly slot: number,
    readonly location: number,
    readonly startsAt: number,
    readonly endsAt: number,
    readonly mode: string,
  ) {}
  encode(stream: ByteStream, now = Date.now()): void {
    stream.writeVInt(-1);
    stream.writeVInt(this.slot);
    stream.writeVInt(0);
    stream.writeVInt(Math.max(0, Math.ceil((this.startsAt - now) / 1000)));
    stream.writeVInt(Math.max(0, Math.ceil((this.endsAt - now) / 1000)));
    stream.writeVInt(0);
    stream.writeDataReference(15, this.location);
    stream.writeDataReference(0);
    stream.writeVInt(2);
    stream.writeString(null);
    for (let i = 0; i < 6; i++) stream.writeVInt(0);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeVInt(0);
    stream.writeBoolean(false);
    stream.writeVInt(0);
    stream.writeVInt(0);
    for (let i = 0; i < 4; i++) stream.writeBoolean(false);
    stream.writeVInt(-1);
    stream.writeBoolean(false);
    stream.writeDataReference(0);
    stream.writeBoolean(false);

    for (let i = 0; i < 4; i++) stream.writeVInt(-1);
    for (let i = 0; i < 8; i++) stream.writeBoolean(false);
  }
}
