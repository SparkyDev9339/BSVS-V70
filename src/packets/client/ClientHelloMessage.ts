import { ByteStream } from '../../misc/ByteStream';
import { ClientMessage } from './ClientMessage';

export class ClientHelloMessage extends ClientMessage {
  readonly type = 10100;
  protocolVersion = 2;
  keyVersion = 0;
  major = 70;
  minor = 0;
  build = 0;
  resourceSha: string | null = null;
  deviceType = 0;
  appStore = 0;
  authenticationData: number[] | null = null;
  hasAuthenticationData = true;
  decode(stream: ByteStream): void {
    this.protocolVersion = stream.readInt();
    this.keyVersion = stream.readInt();
    this.major = stream.readInt();
    this.minor = stream.readInt();
    this.build = stream.readInt();
    this.resourceSha = stream.readString();
    this.deviceType = stream.readInt();
    this.appStore = stream.readInt();
    this.hasAuthenticationData = stream.offset < stream.payload.length;
    this.authenticationData = this.hasAuthenticationData ? stream.readBytes() : null;
    this.decodeTail(stream);
  }
  encode(stream: ByteStream): void {
    stream.writeInt(this.protocolVersion);
    stream.writeInt(this.keyVersion);
    stream.writeInt(this.major);
    stream.writeInt(this.minor);
    stream.writeInt(this.build);
    stream.writeString(this.resourceSha);
    stream.writeInt(this.deviceType);
    stream.writeInt(this.appStore);
    if (this.hasAuthenticationData) stream.writeBytes(this.authenticationData);
    this.encodeTail(stream);
  }
}
