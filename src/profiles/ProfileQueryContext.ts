import { ByteStream } from '../misc/ByteStream';
import { PlayerDisplayData } from './PlayerDisplayData';
type Reference = [number, number];

export class ProfileQueryContext {
  field0 = 0;
  accountId: [number, number] = [0, 0];
  field16 = 0;
  flag20 = false;
  heroes: Array<{ reference: Reference; values: [number, number, number] }> = [];
  references: Reference[] = [];
  field104 = 0;
  display = new PlayerDisplayData();
  optionalId: [number, number] | null = null;
  cardReferences: Reference[] = [
    [0, 0],
    [0, 0],
    [0, 0],
  ];
  values: number[] = [];
  statistics: number[] = [0, 0, 0, 0, 0, 0, 0];
  trailingReferences: Reference[] = Array.from({ length: 9 }, () => [0, 0]);
  private count(stream: ByteStream): number {
    const count = stream.readVInt();
    if (count < 0 || count > 1000) throw new Error('Invalid profile query count');
    return count;
  }
  decode(stream: ByteStream): void {
    this.field0 = stream.readVInt();
    this.accountId = stream.readLong();
    this.field16 = stream.readVInt();
    this.flag20 = stream.readBoolean();
    this.heroes = Array.from({ length: this.count(stream) }, () => ({
      reference: stream.readDataReference(),
      values: [stream.readVInt(), stream.readVInt(), stream.readVInt()] as [number, number, number],
    }));
    this.references = Array.from({ length: this.count(stream) }, () => stream.readDataReference());
    this.field104 = stream.readVInt();
    this.display.decode(stream);
    this.optionalId = stream.readBoolean() ? stream.readLong() : null;
    this.cardReferences = Array.from({ length: 3 }, () => stream.readDataReference());
    this.values = Array.from({ length: this.count(stream) }, () => stream.readVInt());
    this.statistics = Array.from({ length: 7 }, () => stream.readVInt());
    this.trailingReferences = Array.from({ length: 9 }, () => stream.readDataReference());
  }
  encode(stream: ByteStream): void {
    stream.writeVInt(this.field0);
    stream.writeLong(...this.accountId);
    stream.writeVInt(this.field16);
    stream.writeBoolean(this.flag20);
    stream.writeVInt(this.heroes.length);
    for (const hero of this.heroes) {
      stream.writeDataReference(...hero.reference);
      hero.values.forEach(v => stream.writeVInt(v));
    }
    stream.writeVInt(this.references.length);
    this.references.forEach(ref => stream.writeDataReference(...ref));
    stream.writeVInt(this.field104);
    this.display.encode(stream);
    stream.writeBoolean(this.optionalId !== null);
    if (this.optionalId) stream.writeLong(...this.optionalId);
    this.cardReferences.forEach(ref => stream.writeDataReference(...ref));
    stream.writeVInt(this.values.length);
    this.values.forEach(value => stream.writeVInt(value));
    this.statistics.forEach(value => stream.writeVInt(value));
    this.trailingReferences.forEach(ref => stream.writeDataReference(...ref));
  }
}
