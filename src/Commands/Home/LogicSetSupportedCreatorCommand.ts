import { Config } from '../../config';
import { ByteStream } from '../../misc/ByteStream';
import { LogicServerCommand } from '../LogicServerCommand';

export class LogicSetSupportedCreatorCommand extends LogicServerCommand {
  readonly type = 215;
  constructor(public code: string | null = '') {
    super();
  }
  decode(stream: ByteStream) {
    this.code = stream.readBoolean() ? stream.readString() : null;
    super.decode(stream);
  }
  encode(stream: ByteStream) {
    stream.writeBoolean(this.code !== null);
    if (this.code !== null) stream.writeString(this.code);
    super.encode(stream);
  }
  execute(profile: Config): boolean {
    if (this.code === null || this.code.length > 64) return false;
    profile.creator = this.code;
    return true;
  }
}
