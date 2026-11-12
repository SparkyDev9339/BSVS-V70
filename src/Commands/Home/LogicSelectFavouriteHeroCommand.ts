import { Config } from '../../config';
import { ByteStream } from '../../misc/ByteStream';
import { LogicCommand } from '../LogicCommand';

export class LogicSelectFavouriteHeroCommand extends LogicCommand {
  readonly type = 570;
  referenceType = 16;
  value = 0;
  decode(stream: ByteStream) {
    super.decode(stream);
    [this.referenceType, this.value] = stream.readDataReference();
  }
  encode(stream: ByteStream) {
    super.encode(stream);
    stream.writeDataReference(this.referenceType, this.value);
  }
  execute(profile: Config): boolean {
    if (this.referenceType !== 16 || !profile.brawlers.some(b => b.id === this.value)) return false;
    profile.favouriteBrawler = this.value;
    return true;
  }
}
