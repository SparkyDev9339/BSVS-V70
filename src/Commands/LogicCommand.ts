import type { Config } from '../config';
import { ByteStream } from '../misc/ByteStream';

export interface SelectionCatalog {
  skins: ReadonlyMap<number, number>;
  thumbnails: ReadonlySet<number>;
  nameColors: ReadonlySet<number>;
}

export abstract class LogicCommand {
  abstract readonly type: number;
  tickWhenGiven = 0;
  executeTick = 0;
  accountId: [number, number] = [0, 0];
  decode(stream: ByteStream): void {
    this.tickWhenGiven = stream.readVInt();
    this.executeTick = stream.readVInt();
    this.accountId = stream.readVLong();
  }
  encode(stream: ByteStream): void {
    stream.writeVInt(this.tickWhenGiven);
    stream.writeVInt(this.executeTick);
    stream.writeVLong(...this.accountId);
  }
  abstract execute(profile: Config, catalog?: SelectionCatalog): boolean;
}
