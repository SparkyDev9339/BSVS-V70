import { ByteStream } from '../../misc/ByteStream';
import { ClientMessage } from './ClientMessage';

export class AuthenticationMessage extends ClientMessage {
  readonly type = 10101;
  accountId: [number, number] = [0, 0];
  passToken: string | null = null;
  major = 70;
  minor = 1;
  build = 0;
  resourceSha: string | null = null;
  deviceId: string | null = null;
  field256: [number, number] = [0, 0];
  device: string | null = null;
  deviceOSVersion: string | null = null;
  isAndroid = false;
  language: string | null = null;
  preferredLanguage: string | null = null;
  isDevelopmentBuild = false;
  advertisingId: string | null = null;
  randomKey = 0;
  field312 = 0;
  clientVersion: string | null = null;
  field328: string | null = null;
  field344: string | null = null;
  field360 = 0;
  field376: string | null = null;
  field392: string | null = null;
  field408: string | null = null;
  compressedSupercellIdToken: number[] | null = null;
  field424 = false;
  field432: string | null = null;
  field448: string | null = null;
  field464: string | null = null;
  field480: string | null = null;
  field496: string | null = null;
  field512: string | null = null;
  field144: string | null = null;
  field160: string | null = null;
  extensionGroups = 2;
  legacyGroups = 14;
  legacyStrings: Array<string | null> = [null, null, null, null, null, null, null];

  decode(stream: ByteStream): void {
    Object.assign(this, new AuthenticationMessage());
    this.accountId = stream.readLong();
    this.passToken = stream.readString();
    this.major = stream.readInt();
    this.minor = stream.readInt();
    this.build = stream.readInt();
    this.resourceSha = stream.readString();
    if (this.minor === 0) this.decodeLegacy(stream);
    else {
      this.deviceId = stream.readString();
      this.field256 = stream.readDataReference();
      this.device = stream.readString();
      this.deviceOSVersion = stream.readString();
      this.isAndroid = stream.readBoolean();
      this.language = stream.readString();
      this.preferredLanguage = stream.readString();
      this.isDevelopmentBuild = stream.readBoolean();
      this.advertisingId = stream.readString();
      this.randomKey = stream.readInt();
      this.field312 = stream.readVInt();
      this.clientVersion = stream.readString();
      this.field328 = stream.readString();
      this.field344 = stream.readString();
      this.field360 = stream.readVInt();
      this.field376 = stream.readString();
      this.field392 = stream.readString();
      this.field408 = stream.readString();
      this.compressedSupercellIdToken = stream.readBytes();
      this.field424 = stream.readBoolean();
      this.field432 = stream.readString();
      this.field448 = stream.readString();
      this.extensionGroups = 0;
      if (stream.offset < stream.payload.length) {
        this.extensionGroups = 1;
        this.field464 = stream.readString();
        this.field480 = stream.readString();
        this.field496 = stream.readString();
        this.field512 = stream.readString();
        if (stream.offset < stream.payload.length) {
          this.extensionGroups = 2;
          this.field144 = stream.readString();
          this.field160 = stream.readString();
        }
      }
    }
    this.decodeTail(stream);
  }
  encode(stream: ByteStream): void {
    stream.writeLong(...this.accountId);
    stream.writeString(this.passToken);
    stream.writeInt(this.major);
    stream.writeInt(this.minor);
    stream.writeInt(this.build);
    stream.writeString(this.resourceSha);
    if (this.minor === 0) this.encodeLegacy(stream);
    else {
      stream.writeString(this.deviceId);
      stream.writeDataReference(...this.field256);
      stream.writeString(this.device);
      stream.writeString(this.deviceOSVersion);
      stream.writeBoolean(this.isAndroid);
      stream.writeString(this.language);
      stream.writeString(this.preferredLanguage);
      stream.writeBoolean(this.isDevelopmentBuild);
      stream.writeString(this.advertisingId);
      stream.writeInt(this.randomKey);
      stream.writeVInt(this.field312);
      stream.writeString(this.clientVersion);
      stream.writeString(this.field328);
      stream.writeString(this.field344);
      stream.writeVInt(this.field360);
      stream.writeString(this.field376);
      stream.writeString(this.field392);
      stream.writeString(this.field408);
      stream.writeBytes(this.compressedSupercellIdToken);
      stream.writeBoolean(this.field424);
      stream.writeString(this.field432);
      stream.writeString(this.field448);
      if (this.extensionGroups >= 1) {
        stream.writeString(this.field464);
        stream.writeString(this.field480);
        stream.writeString(this.field496);
        stream.writeString(this.field512);
      }
      if (this.extensionGroups >= 2) {
        stream.writeString(this.field144);
        stream.writeString(this.field160);
      }
    }
    this.encodeTail(stream);
  }

  private decodeLegacy(stream: ByteStream): void {
    this.legacyGroups = 0;
    this.legacyStrings[0] = stream.readString();
    this.legacyStrings[1] = stream.readString();
    this.legacyStrings[2] = stream.readString();
    this.deviceId = stream.readString();
    if (stream.offset === stream.payload.length) return;
    this.field256 = stream.readDataReference();
    this.device = stream.readString();
    this.legacyGroups = 1;
    if (stream.offset === stream.payload.length) return;
    this.legacyStrings[3] = stream.readString();
    this.legacyGroups = 2;
    if (stream.offset === stream.payload.length) return;
    this.deviceOSVersion = stream.readString();
    this.legacyGroups = 3;
    if (stream.offset === stream.payload.length) return;
    this.isAndroid = stream.readBoolean();
    this.legacyGroups = 4;
    if (stream.offset === stream.payload.length) return;
    this.language = stream.readString();
    this.preferredLanguage = stream.readString();
    this.legacyGroups = 5;
    if (stream.offset === stream.payload.length) return;
    this.legacyStrings[4] = stream.readString();
    this.legacyGroups = 6;
    if (stream.offset === stream.payload.length) return;
    this.isDevelopmentBuild = stream.readBoolean();
    this.advertisingId = stream.readString();
    this.legacyGroups = 7;
    if (stream.offset === stream.payload.length) return;
    this.randomKey = stream.readInt();
    this.legacyGroups = 8;
    if (stream.offset === stream.payload.length) return;
    this.field312 = stream.readVInt();
    this.legacyStrings[5] = stream.readString();
    this.legacyStrings[6] = stream.readString();
    this.legacyGroups = 9;
    if (stream.offset === stream.payload.length) return;
    this.clientVersion = stream.readString();
    this.legacyGroups = 10;
    if (stream.offset === stream.payload.length) return;
    this.field328 = stream.readString();
    this.field344 = stream.readString();
    this.field360 = stream.readVInt();
    this.legacyGroups = 11;
    if (stream.offset === stream.payload.length) return;
    this.field376 = stream.readString();
    this.field392 = stream.readString();
    this.field408 = stream.readString();
    this.legacyGroups = 12;
    if (stream.offset === stream.payload.length) return;
    this.compressedSupercellIdToken = stream.readBytes();
    this.legacyGroups = 13;
    if (stream.offset === stream.payload.length) return;
    this.field424 = stream.readBoolean();
    this.legacyGroups = 14;
  }
  private encodeLegacy(stream: ByteStream): void {
    stream.writeString(this.legacyStrings[0]);
    stream.writeString(this.legacyStrings[1]);
    stream.writeString(this.legacyStrings[2]);
    stream.writeString(this.deviceId);
    if (this.legacyGroups < 1) return;
    stream.writeDataReference(...this.field256);
    stream.writeString(this.device);
    if (this.legacyGroups < 2) return;
    stream.writeString(this.legacyStrings[3]);
    if (this.legacyGroups < 3) return;
    stream.writeString(this.deviceOSVersion);
    if (this.legacyGroups < 4) return;
    stream.writeBoolean(this.isAndroid);
    if (this.legacyGroups < 5) return;
    stream.writeString(this.language);
    stream.writeString(this.preferredLanguage);
    if (this.legacyGroups < 6) return;
    stream.writeString(this.legacyStrings[4]);
    if (this.legacyGroups < 7) return;
    stream.writeBoolean(this.isDevelopmentBuild);
    stream.writeString(this.advertisingId);
    if (this.legacyGroups < 8) return;
    stream.writeInt(this.randomKey);
    if (this.legacyGroups < 9) return;
    stream.writeVInt(this.field312);
    stream.writeString(this.legacyStrings[5]);
    stream.writeString(this.legacyStrings[6]);
    if (this.legacyGroups < 10) return;
    stream.writeString(this.clientVersion);
    if (this.legacyGroups < 11) return;
    stream.writeString(this.field328);
    stream.writeString(this.field344);
    stream.writeVInt(this.field360);
    if (this.legacyGroups < 12) return;
    stream.writeString(this.field376);
    stream.writeString(this.field392);
    stream.writeString(this.field408);
    if (this.legacyGroups < 13) return;
    stream.writeBytes(this.compressedSupercellIdToken);
    if (this.legacyGroups < 14) return;
    stream.writeBoolean(this.field424);
  }
}
