import { Config } from '../../config';
import { ByteStream } from '../../misc/ByteStream';
import { LogicServerCommand } from '../LogicServerCommand';

export class LogicChangeAvatarNameCommand extends LogicServerCommand {
  readonly type = 201;
  constructor(
    public name = '',
    public changeNameCost = 0,
    public metadata: string | null = null,
  ) {
    super();
  }
  decode(stream: ByteStream) {
    this.name = stream.readString() ?? '';
    this.changeNameCost = stream.readVInt();
    this.metadata = stream.readString();
    super.decode(stream);
  }
  encode(stream: ByteStream) {
    stream.writeString(this.name);
    stream.writeVInt(this.changeNameCost);
    stream.writeString(this.metadata);
    super.encode(stream);
  }
  execute(profile: Config): boolean {
    if (!this.name.trim() || this.name.length > 32) return false;
    profile.name = this.name;
    profile.registered = true;
    return true;
  }
}
