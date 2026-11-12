export class ByteStream {
  payload: number[];
  offset = 0;
  bitoffset = 0;
  constructor(payload: number[] = []) {
    this.payload = payload;
  }
  private require(n: number) {
    if (n < 0 || this.offset + n > this.payload.length)
      throw new Error(`Truncated packet at ${this.offset}, need ${n}`);
  }
  readByte() {
    this.bitoffset = 0;
    this.require(1);
    return this.payload[this.offset++];
  }
  readInt() {
    return (
      (this.readByte() << 24) | (this.readByte() << 16) | (this.readByte() << 8) | this.readByte()
    );
  }
  readVInt() {
    let b = this.readByte();
    const negative = !!(b & 64);
    let value = b & 63,
      shift = 6;
    while (b & 128) {
      if (shift > 27) throw new Error('Invalid VInt');
      b = this.readByte();
      value |= (b & 127) << shift;
      shift += 7;
    }
    if (negative && shift < 32) value |= -1 << shift;
    return value | 0;
  }
  readVLong(): [number, number] {
    return [this.readVInt(), this.readVInt()];
  }
  readLong(): [number, number] {
    return [this.readInt(), this.readInt()];
  }
  readBytes(maxLength = 900000): number[] | null {
    const length = this.readInt();
    if (length === -1) return null;
    if (length < 0 || length > maxLength) throw new Error('Invalid byte array size');
    this.require(length);
    const bytes = this.payload.slice(this.offset, this.offset + length);
    this.offset += length;
    return bytes;
  }
  readDataReference(): [number, number] {
    const type = this.readVInt();
    return [type, type === 0 ? 0 : this.readVInt()];
  }
  readBoolean() {
    if (this.bitoffset === 0) {
      this.require(1);
      this.offset++;
    }
    const result = !!(this.payload[this.offset - 1] & (1 << this.bitoffset));
    this.bitoffset = (this.bitoffset + 1) & 7;
    return result;
  }
  readString(): string | null {
    const size = this.readInt();
    if (size === -1) return null;
    if (size < 0 || size > 1024 * 1024) throw new Error('Invalid string size');
    this.require(size);
    const bytes = this.payload.slice(this.offset, this.offset + size);
    this.offset += size;
    return decodeURIComponent(bytes.map(x => '%' + x.toString(16).padStart(2, '0')).join(''));
  }
  writeByte(value: number) {
    this.bitoffset = 0;
    this.payload.push(value & 255);
    this.offset++;
  }
  writeInt(value: number) {
    for (const shift of [24, 16, 8, 0]) this.writeByte(value >>> shift);
  }
  writeVInt(value: number) {
    value |= 0;
    let rest = value >> 6;
    let first = (value & 63) | (value < 0 ? 64 : 0);
    const terminal = value < 0 ? -1 : 0;
    if (rest !== terminal) first |= 128;
    this.writeByte(first);
    while (rest !== terminal) {
      const byte = rest & 127;
      rest >>= 7;
      this.writeByte(byte | (rest !== terminal ? 128 : 0));
    }
  }
  writeBoolean(value: boolean) {
    if (this.bitoffset === 0) {
      this.payload.push(0);
      this.offset++;
    }
    if (value) this.payload[this.offset - 1] |= 1 << this.bitoffset;
    this.bitoffset = (this.bitoffset + 1) & 7;
  }
  writeString(value: string | null = null) {
    if (value === null) {
      this.writeInt(-1);
      return;
    }
    const encoded = encodeURIComponent(value);
    const bytes: number[] = [];
    for (let i = 0; i < encoded.length; i++) {
      if (encoded[i] === '%') {
        bytes.push(parseInt(encoded.slice(i + 1, i + 3), 16));
        i += 2;
      } else bytes.push(encoded.charCodeAt(i));
    }
    this.writeInt(bytes.length);
    bytes.forEach(x => this.writeByte(x));
  }
  writeStringReference(value: string | null) {
    this.writeString(value);
  }
  writeLong(high: number, low: number) {
    this.writeInt(high);
    this.writeInt(low);
  }
  writeBytes(bytes: readonly number[] | null): void {
    this.writeInt(bytes === null ? -1 : bytes.length);
    if (bytes !== null) for (const byte of bytes) this.writeByte(byte);
  }
  writeVLong(high: number, low: number) {
    this.writeVInt(high);
    this.writeVInt(low);
  }
  writeDataReference(type: number, id = 0) {
    this.writeVInt(type);
    if (type !== 0) this.writeVInt(id);
  }
}
