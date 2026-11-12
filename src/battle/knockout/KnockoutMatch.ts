export type Team = 0 | 1;
export type RoundResult = Team | 100;
export interface KnockoutRules {
  rounds: number;
  winsRequired: number;
  betweenRoundsTicks: number;
  roundLimitTicks: number;
}
export const knockoutRules: KnockoutRules = {
  rounds: 3,
  winsRequired: 2,
  betweenRoundsTicks: 60,
  roundLimitTicks: 2400,
};
export interface RoundUpdate {
  reset: boolean;
  respawn: boolean;
  roundEnded: RoundResult | null;
  finished: boolean;
}

export class KnockoutMatch {
  readonly results: RoundResult[] = [];
  readonly score: [number, number] = [0, 0];
  phase: 'playing' | 'intermission' | 'finished' = 'playing';
  winner: RoundResult | null = null;
  roundStartedAt: number;
  private nextRoundAt = 0;
  private prepared = false;
  private lastTick: number;
  constructor(
    tick: number,
    readonly rules: KnockoutRules = knockoutRules,
    initialDelayTicks = 0,
  ) {
    if (
      !Number.isInteger(initialDelayTicks) ||
      initialDelayTicks < 0 ||
      !Number.isInteger(tick) ||
      tick < 0 ||
      rules.rounds !== 3 ||
      rules.winsRequired !== 2 ||
      !Number.isInteger(rules.betweenRoundsTicks) ||
      rules.betweenRoundsTicks < 1 ||
      !Number.isInteger(rules.roundLimitTicks) ||
      rules.roundLimitTicks < 1
    )
      throw new Error('Invalid Knockout rules');
    this.lastTick = tick;
    this.roundStartedAt = tick + initialDelayTicks;
  }
  get round(): number {
    return Math.max(
      0,
      Math.min(
        this.results.length -
          (this.phase === 'playing' || (this.phase === 'intermission' && this.prepared) ? 0 : 1),
        this.rules.rounds - 1,
      ),
    );
  }
  elapsed(tick: number): number {
    return this.phase === 'playing' ? Math.max(0, tick - this.roundStartedAt) : 0;
  }
  remaining(tick: number): number {
    return this.phase === 'intermission' ? Math.max(1, this.nextRoundAt - tick) : 0;
  }
  update(tick: number, alive: readonly [number, number]): RoundUpdate {
    if (
      !Number.isInteger(tick) ||
      tick < this.lastTick ||
      alive.some(n => !Number.isInteger(n) || n < 0 || n > 3)
    )
      throw new Error('Invalid Knockout tick/roster');
    this.lastTick = tick;
    const update: RoundUpdate = {
      reset: false,
      respawn: false,
      roundEnded: null,
      finished: this.phase === 'finished',
    };
    if (this.phase === 'finished' || tick < this.roundStartedAt) return update;
    if (this.phase === 'intermission') {
      const lead = Math.min(20, this.rules.betweenRoundsTicks - 1);
      if (!this.prepared && tick >= this.nextRoundAt - lead) {
        this.prepared = true;
        update.respawn = true;
      }
      if (tick >= this.nextRoundAt) {
        this.roundStartedAt = tick;
        this.phase = 'playing';
        update.reset = true;
      }
      return update;
    }
    let result: RoundResult | null = null;
    if (alive[0] === 0 && alive[1] === 0) result = 100;
    else if (alive[0] === 0) result = 1;
    else if (alive[1] === 0) result = 0;
    else if (this.elapsed(tick) >= this.rules.roundLimitTicks) result = 100;
    if (result === null) return update;
    this.results.push(result);
    if (result !== 100) this.score[result]++;
    update.roundEnded = result;
    if (
      this.score[0] >= this.rules.winsRequired ||
      this.score[1] >= this.rules.winsRequired ||
      this.results.length >= this.rules.rounds
    ) {
      this.phase = 'finished';
      this.winner = this.score[0] === this.score[1] ? 100 : this.score[0] > this.score[1] ? 0 : 1;
      update.finished = true;
    } else {
      this.phase = 'intermission';
      this.prepared = false;
      this.nextRoundAt = tick + this.rules.betweenRoundsTicks;
    }
    return update;
  }
}
