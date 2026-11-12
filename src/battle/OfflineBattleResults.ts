import { ClientBattlePlayer } from './ClientBattlePlayer';
import { AskForBattleEndMessage } from '../packets/client/AskForBattleEndMessage';
import type { RoundResult } from './knockout/KnockoutMatch';

type RosterEntry = { team: number; isBot: boolean };

export class OfflineBattleResults {
  private current: {
    key: string;
    variation: number | null;
    players: Map<number, RosterEntry>;
    winner: RoundResult | null;
  } | null = null;
  begin(key: string): void {
    this.current = { key, variation: null, players: new Map(), winner: null };
  }
  reset(): void {
    this.current = null;
  }
  record(key: string, variation: number, index: number, team: number, isBot: boolean): void {
    if (!this.current || this.current.key !== key) this.begin(key);
    this.current!.variation = variation;
    this.current!.players.set(index, { team, isBot });
  }
  finishTeamMatch(key: string, variation: number, winner: RoundResult): void {
    if (this.current?.key === key && this.current.variation === variation)
      this.current.winner = winner;
  }
  finishKnockout(key: string, winner: RoundResult): void {
    this.finishTeamMatch(key, 20, winner);
  }
  prepare(message: AskForBattleEndMessage, variation: number): AskForBattleEndMessage {
    const context = this.current;
    if (!context) return message;
    if (
      context.variation !== variation ||
      context.players.size !== message.players.length ||
      !message.players.every((p, i) => context.players.get(i)?.team === p.teamIndex)
    )
      throw new Error('Battle result does not match the active native roster');
    const local = [...context.players].filter(([, p]) => !p.isBot);
    if (local.length !== 1) throw new Error('Native offline roster requires one human player');
    const [index, player] = local[0];
    const result = Object.assign(new AskForBattleEndMessage(), message);
    result.players = message.players.map((p, i) =>
      Object.assign(new ClientBattlePlayer(), p, { isPlayer: i === index }),
    );
    if ((variation === 20 || variation === 17) && context.winner !== null) {
      result.battleResult = context.winner === 100 ? 2 : context.winner === player.team ? 0 : 1;
    }
    return result;
  }
}
