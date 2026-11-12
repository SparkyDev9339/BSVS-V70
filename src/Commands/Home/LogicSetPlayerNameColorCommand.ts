import { Config } from '../../config';
import { ByteStream } from '../../misc/ByteStream';
import { LogicCommand, type SelectionCatalog } from '../LogicCommand';

export class LogicSetPlayerNameColorCommand extends LogicCommand {
  readonly type = 527;
  referenceType = 43;
  value = 0;
  decode(stream: ByteStream) {
    super.decode(stream);
    [this.referenceType, this.value] = stream.readDataReference();
  }
  encode(stream: ByteStream) {
    super.encode(stream);
    stream.writeDataReference(this.referenceType, this.value);
  }
  execute(profile: Config, catalog?: SelectionCatalog): boolean {
    if (this.referenceType !== 43) return false;
    if (
      !Number.isInteger(this.value) ||
      this.value < 0 ||
      (catalog && !catalog.nameColors.has(this.value))
    )
      return false;
    profile.nameColor = this.value;
    return true;
  }
}
