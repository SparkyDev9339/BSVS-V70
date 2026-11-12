import { ByteStream } from '../misc/ByteStream';

export class BrawlPassSeasonData {
  season = 55;
  points = 0;
  premium = true;
  progress = 0;
  flag41 = false;
  flag40 = false;
  rewardBits8: number[] | null = [0, 0, 0, 0];
  rewardBits16: number[] | null = [0, 0, 0, 0];
  flag42 = false;
  rewardBits24: number[] | null = [0, 0, 0, 0];
  tailReference: [number, number] = [0, 0];
  tailEntries: { value8: number; value12: number; reference: [number, number] }[] = [];
  value72 = 0;
  private readBits(s: ByteStream): number[] | null {
    return s.readBoolean() ? Array.from({ length: 4 }, () => s.readInt()) : null;
  }
  private writeBits(s: ByteStream, bits: number[] | null): void {
    s.writeBoolean(bits !== null);
    if (bits) {
      if (bits.length !== 4) throw new Error('Brawl Pass reward bitset must have 128 bits');
      bits.forEach(value => s.writeInt(value));
    }
  }
  decode(s: ByteStream): void {
    this.season = s.readVInt();
    this.points = s.readVInt();
    this.premium = s.readBoolean();
    this.progress = s.readVInt();
    this.flag41 = s.readBoolean();
    this.flag40 = s.readBoolean();
    this.rewardBits8 = this.readBits(s);
    this.rewardBits16 = this.readBits(s);
    this.flag42 = s.readBoolean();
    this.rewardBits24 = this.readBits(s);
    this.tailReference = s.readDataReference();
    const count = s.readVInt();
    if (count < 0 || count > 1000) throw new Error('Invalid Brawl Pass tail count');
    this.tailEntries = Array.from({ length: count }, () => ({
      value8: s.readVInt(),
      value12: s.readVInt(),
      reference: s.readDataReference(),
    }));
    this.value72 = s.readInt();
  }
  encode(s: ByteStream): void {
    s.writeVInt(this.season);
    s.writeVInt(this.points);
    s.writeBoolean(this.premium);
    s.writeVInt(this.progress);
    s.writeBoolean(this.flag41);
    s.writeBoolean(this.flag40);
    this.writeBits(s, this.rewardBits8);
    this.writeBits(s, this.rewardBits16);
    s.writeBoolean(this.flag42);
    this.writeBits(s, this.rewardBits24);
    s.writeDataReference(...this.tailReference);
    s.writeVInt(this.tailEntries.length);
    for (const entry of this.tailEntries) {
      s.writeVInt(entry.value8);
      s.writeVInt(entry.value12);
      s.writeDataReference(...entry.reference);
    }
    s.writeInt(this.value72);
  }
}

export function penultimatePassSeason(rows: readonly { values: Record<string, string> }[]): number {
  const seasons = [
    ...new Set(
      rows
        .map(row => Number(row.values.Season))
        .filter(value => Number.isInteger(value) && value >= 0),
    ),
  ].sort((a, b) => a - b);
  if (seasons.length < 2) throw new Error('Cannot find the penultimate Brawl Pass season');
  return seasons[seasons.length - 2];
}
