import type { Config } from '../../config';
import { ByteStream } from '../../misc/ByteStream';
import { LogicCommand, type SelectionCatalog } from '../LogicCommand';

export class LogicSelectSkinCommand extends LogicCommand {
  readonly type = 506;
  referenceType = 29;
  skinId = 0;
  selectionType = 0;
  decode(stream: ByteStream): void {
    super.decode(stream);
    [this.referenceType, this.skinId] = stream.readDataReference();
    this.selectionType = stream.readVInt();
  }
  encode(stream: ByteStream): void {
    super.encode(stream);
    stream.writeDataReference(this.referenceType, this.skinId);
    stream.writeVInt(this.selectionType);
  }
  execute(profile: Config, catalog?: SelectionCatalog): boolean {
    const hero = catalog?.skins.get(this.skinId);
    if (
      this.referenceType !== 29 ||
      hero === undefined ||
      !profile.brawlers.some(b => b.id === hero) ||
      ![0, 1, 2].includes(this.selectionType)
    )
      return false;
    const sameHero = (id: number) => catalog!.skins.get(id) === hero;
    if (this.selectionType === 0) {
      profile.selectedSkins = profile.selectedSkins.filter(id => !sameHero(id));
      profile.selectedSkins.push(this.skinId);
    } else if (this.selectionType === 1) {
      if (!profile.skinRandomizer.includes(this.skinId)) profile.skinRandomizer.push(this.skinId);
      if (!profile.currentRandomSkins.some(sameHero)) profile.currentRandomSkins.push(this.skinId);
    } else {
      profile.skinRandomizer = profile.skinRandomizer.filter(id => id !== this.skinId);
      if (profile.currentRandomSkins.includes(this.skinId)) {
        profile.currentRandomSkins = profile.currentRandomSkins.filter(id => id !== this.skinId);
        const replacement = profile.skinRandomizer.find(sameHero);
        if (replacement !== undefined) profile.currentRandomSkins.push(replacement);
      }
    }
    return true;
  }
}
