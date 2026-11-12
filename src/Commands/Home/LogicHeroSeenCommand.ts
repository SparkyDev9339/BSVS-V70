import type { Config } from '../../config';
import { ByteStream } from '../../misc/ByteStream';
import { LogicCommand } from '../LogicCommand';

export class LogicHeroSeenCommand extends LogicCommand {
  readonly type = 522;
  referenceType = 16;
  characterId = 0;
  seenState = 0;
  decode(stream: ByteStream): void {
    super.decode(stream);
    [this.referenceType, this.characterId] = stream.readDataReference();
    this.seenState = stream.readInt();
  }
  encode(stream: ByteStream): void {
    super.encode(stream);
    stream.writeDataReference(this.referenceType, this.characterId);
    stream.writeInt(this.seenState);
  }
  execute(_profile: Config): boolean {
    return false;
  }
}
