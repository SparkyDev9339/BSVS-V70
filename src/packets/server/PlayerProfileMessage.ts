import { Config } from '../../config';
import { ByteStream } from '../../misc/ByteStream';
import { PlayerDisplayData } from '../../profiles/PlayerDisplayData';

export class PlayerProfileMessage {
  readonly type = 24113;
  constructor(
    readonly profile: Config,
    private readonly skinOwners?: ReadonlyMap<number, number>,
  ) {}
  encode(): number[] {
    const s = new ByteStream(),
      p = this.profile;
    s.writeVLong(p.id[0], p.id[1]);
    s.writeDataReference(16, p.favouriteBrawler);
    s.writeDataReference(0);
    s.writeVInt(p.brawlers.length);
    for (const hero of p.brawlers) {
      s.writeDataReference(16, hero.id);
      const skin = p.selectedSkins.find(id => this.skinOwners?.get(id) === hero.id);
      if (skin === undefined) s.writeDataReference(0);
      else s.writeDataReference(29, skin);
      s.writeVInt(hero.trophies);
      s.writeVInt(hero.trophies);
      s.writeVInt(0);
      s.writeVInt(hero.power - 1);
      s.writeVInt(0);
    }
    const trophies = Math.min(
      2147483647,
      p.brawlers.reduce((total, hero) => total + hero.trophies, 0),
    );
    const stats = [
      [1, 0],
      [8, 0],
      [11, 0],
      [29, trophies],
      [4, trophies],
    ];
    s.writeVInt(stats.length);
    for (const [key, value] of stats) {
      s.writeVInt(key);
      s.writeVInt(value);
    }
    const display = new PlayerDisplayData();
    display.name = p.name;
    display.thumbnail = 28000000 + p.thumbnail;
    display.nameColor = display.premiumNameColor = 43000000 + p.nameColor;
    display.encode(s);
    s.writeBoolean(false);
    s.writeString(null);
    s.writeVInt(0);
    s.writeVInt(0);
    s.writeVInt(0);
    for (let i = 0; i < 7; i++) s.writeDataReference(0);
    s.writeVInt(0);
    s.writeString(null);
    s.writeString(null);
    s.writeBoolean(false);
    s.writeDataReference(0);
    s.writeVInt(0);
    return s.payload;
  }
}
