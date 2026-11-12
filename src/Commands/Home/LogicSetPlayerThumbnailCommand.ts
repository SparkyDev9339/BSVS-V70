import { Config } from '../../config';
import { ByteStream } from '../../misc/ByteStream';
import { LogicCommand, type SelectionCatalog } from '../LogicCommand';

export class LogicSetPlayerThumbnailCommand extends LogicCommand {
  readonly type = 505;
  referenceType = 28;
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
    if (this.referenceType !== 28) return false;
    if (
      !Number.isInteger(this.value) ||
      this.value < 0 ||
      (catalog && !catalog.thumbnails.has(this.value))
    )
      return false;
    profile.thumbnail = this.value;
    return true;
  }
}
