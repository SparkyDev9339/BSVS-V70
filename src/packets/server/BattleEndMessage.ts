import type { Config } from '../../config';
import { ByteStream } from '../../misc/ByteStream';
import type { AskForBattleEndMessage } from '../client/AskForBattleEndMessage';
import { BattleResultPlayer } from '../../battle/BattleResultPlayer';

export class BattleEndMessage {
  readonly type = 23456;
  constructor(
    readonly battle: AskForBattleEndMessage,
    readonly profile: Config,
    readonly gameMode = 1,
    readonly variation = 0,
  ) {
    if (!Number.isInteger(gameMode) || ![0, 1, 2, 5, 7].includes(gameMode))
      throw new Error('Invalid battle result mode');
    if (!Number.isInteger(variation) || variation < 0 || variation > 90)
      throw new Error('Invalid battle mode variation');
    if (
      battle.players.length < 1 ||
      battle.players.length > 100 ||
      battle.players.filter(p => p.isPlayer).length !== 1
    )
      throw new Error('Battle result requires one local player');
    if (![0, 1, 2].includes(battle.battleResult)) throw new Error('Invalid battle result');
    if (
      (gameMode === 2 || gameMode === 5) &&
      (!Number.isInteger(battle.rank) || battle.rank < 1 || battle.rank > 100)
    )
      throw new Error('Invalid battle placement');
  }
  encode(): number[] {
    const s = new ByteStream(),
      own = this.battle.players.find(p => p.isPlayer)!;
    s.writeLong(0, 0);
    s.writeLong(0, 0);
    s.writeVInt(this.gameMode);
    s.writeVInt(
      this.gameMode === 2 || this.gameMode === 5 ? this.battle.rank : this.battle.battleResult,
    );
    for (let i = 0; i < 9; i++) s.writeVInt(0);
    s.writeBoolean(false);
    s.writeVInt(0);
    s.writeVInt(0);
    s.writeBoolean(false);
    s.writeBoolean(false);
    for (let i = 0; i < 8; i++) s.writeVInt(0);
    for (let i = 0; i < 6; i++) s.writeBoolean(false);
    s.writeVInt(-1);
    s.writeBoolean(false);
    const players =
      this.gameMode === 0 || this.gameMode === 2
        ? [own]
        : this.gameMode === 5
          ? this.battle.players.filter(p => p.teamIndex === own.teamIndex)
          : this.battle.players;
    s.writeVInt(players.length);
    for (const player of players)
      new BattleResultPlayer(player, own.teamIndex, this.profile).encode(s);
    s.writeVInt(0);
    s.writeVInt(0);
    s.writeVInt(0);
    s.writeDataReference(0);
    s.writeBoolean(false);
    s.writeBoolean(false);
    s.writeBoolean(false);
    s.writeBoolean(false);
    s.writeVInt(this.variation);
    s.writeVInt(0);
    s.writeVInt(0);
    s.writeBoolean(false);
    s.writeVInt(0);
    s.writeBoolean(false);
    s.writeVInt(0);
    for (let i = 0; i < 5; i++) s.writeBoolean(false);
    s.writeVInt(0);
    s.writeVInt(0);
    s.writeBoolean(false);
    s.writeBoolean(false);
    for (let i = 0; i < 5; i++) s.writeVInt(0);
    s.writeBoolean(false);
    s.writeBoolean(false);
    s.writeBoolean(false);
    s.writeVInt(0);
    s.writeBoolean(false);
    s.writeVInt(0);
    s.writeDataReference(0);
    s.writeBoolean(false);
    s.writeVInt(0);
    s.writeVInt(1);
    s.writeVInt(-1);
    s.writeBoolean(false);
    s.writeVInt(0);
    s.writeBoolean(false);
    s.writeVInt(-1);
    s.writeVInt(-1);
    s.writeBoolean(false);
    s.writeVInt(0);
    s.writeVInt(0);
    s.writeDataReference(0);
    s.writeVInt(0);
    return s.payload;
  }
}
