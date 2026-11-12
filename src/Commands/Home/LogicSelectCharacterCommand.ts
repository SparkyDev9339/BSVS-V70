import { Config } from '../../config';
import { ByteStream } from '../../misc/ByteStream';
import { LogicCommand } from '../LogicCommand';

export class LogicSelectCharacterCommand extends LogicCommand {
  readonly type = 525;
  referenceType = 16;
  characterId = 0;
  slot = 0;
  decode(stream: ByteStream) {
    super.decode(stream);
    [this.referenceType, this.characterId] = stream.readDataReference();

    this.slot = (stream.readByte() << 24) >> 24;
  }
  encode(stream: ByteStream) {
    super.encode(stream);
    stream.writeDataReference(this.referenceType, this.characterId);
    stream.writeByte(this.slot);
  }
  execute(profile: Config): boolean {
    if (
      this.referenceType !== 16 ||
      this.slot < 0 ||
      this.slot >= 3 ||
      !profile.brawlers.some(b => b.id === this.characterId)
    )
      return false;
    profile.selectedBrawlers[this.slot] = this.characterId;
    return true;
  }
}
