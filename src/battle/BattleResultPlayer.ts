import type { Config } from '../config';
import { ByteStream } from '../misc/ByteStream';
import { PlayerDisplayData } from '../profiles/PlayerDisplayData';
import type { ClientBattlePlayer } from './ClientBattlePlayer';

export class BattleResultPlayer {
  constructor(
    readonly player: ClientBattlePlayer,
    readonly ownTeam: number,
    readonly profile: Config,
  ) {}
  encode(s: ByteStream): void {
    const p = this.player,
      own = p.isPlayer;
    const hero = own ? this.profile.brawlers.find(h => h.id === p.character[1]) : undefined;
    s.writeBoolean(own);
    s.writeBoolean(p.teamIndex !== this.ownTeam);
    s.writeBoolean(false);
    s.writeVInt(1);
    s.writeDataReference(...p.character);
    s.writeVInt(1);
    s.writeDataReference(...p.skin);
    s.writeVInt(1);
    s.writeVInt(hero?.trophies ?? 0);
    s.writeVInt(1);
    s.writeVInt(0);
    s.writeVInt(1);
    s.writeVInt(hero?.power ?? 1);
    s.writeVInt(0);
    s.writeBoolean(own);
    if (own) s.writeLong(this.profile.id[0], this.profile.id[1]);
    const display = new PlayerDisplayData();
    display.name = p.name ?? (own ? this.profile.name : null);
    if (own) {
      display.thumbnail += this.profile.thumbnail;
      display.nameColor += this.profile.nameColor;
      display.premiumNameColor = display.nameColor;
    }
    display.encode(s);
    s.writeBoolean(false);

    for (let i = 0; i < 4; i++) s.writeByte(0);
    for (let i = 0; i < 4; i++) s.writeInt(0);
    s.writeDataReference(0);
    s.writeDataReference(0);
    s.writeVInt(0);
    s.writeVInt(0);
    s.writeVInt(0);
    s.writeVInt(0);
    for (let i = 0; i < 9; i++) s.writeDataReference(0);
  }
}
