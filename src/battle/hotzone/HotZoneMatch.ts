export type Zone = { x: number; y: number; radius: number };
export type ZonePlayer = {
  team: number;
  x: number;
  y: number;
  z: number;
  alive: boolean;
  inRealm: boolean;
};

export class HotZoneMatch {
  readonly captureTicks: [number, number][];
  readonly occupied: [boolean, boolean][];
  readonly zoneTarget: number;
  winner: 0 | 1 | 100 | null = null;
  private lastTick = -1;
  constructor(
    readonly zones: readonly Zone[],
    readonly startTick: number,
    readonly endTick: number,
    readonly ticksPerPoint = 12,
  ) {
    if (
      !zones.length ||
      zones.length > 3 ||
      zones.some(
        z =>
          !Number.isFinite(z.x) ||
          !Number.isFinite(z.y) ||
          !Number.isFinite(z.radius) ||
          z.radius <= 0,
      ) ||
      endTick <= startTick ||
      !Number.isInteger(ticksPerPoint) ||
      ticksPerPoint < 1
    )
      throw new Error('Invalid Hot Zone rules');
    this.zoneTarget = Math.floor(100 / zones.length);
    this.captureTicks = zones.map(() => [0, 0]);
    this.occupied = zones.map(() => [false, false]);
  }
  zoneScore(zone: number, team: number): number {
    return Math.min(
      this.zoneTarget,
      Math.floor(this.captureTicks[zone][team] / this.ticksPerPoint),
    );
  }
  zonePercent(zone: number, team: number): number {
    return Math.floor((this.zoneScore(zone, team) * 100) / this.zoneTarget);
  }
  score(team: number): number {
    return this.zones.reduce((total, _, i) => total + this.zoneScore(i, team), 0);
  }
  percent(team: number): number {
    return Math.floor((this.score(team) * 100) / (this.zoneTarget * this.zones.length));
  }
  update(tick: number, players: readonly ZonePlayer[], doubled = false): void {
    if (this.winner !== null || tick <= this.lastTick) return;
    this.lastTick = tick;
    if (tick < this.startTick) return;
    if (tick < this.endTick)
      this.zones.forEach((zone, i) => {
        const inside: [boolean, boolean] = [false, false];
        for (const player of players) {
          if (
            (player.team !== 0 && player.team !== 1) ||
            !player.alive ||
            player.z > 0 ||
            player.inRealm
          )
            continue;
          if ((player.x - zone.x) ** 2 + (player.y - zone.y) ** 2 <= zone.radius ** 2)
            inside[player.team] = true;
        }
        this.occupied[i] = inside;
        for (const team of [0, 1])
          if (inside[team])
            this.captureTicks[i][team] = Math.min(
              this.zoneTarget * this.ticksPerPoint,
              this.captureTicks[i][team] + (doubled ? 2 : 1),
            );
      });
    const target = this.zoneTarget * this.zones.length,
      a = this.score(0),
      b = this.score(1);
    if (a === target || b === target || tick >= this.endTick)
      this.winner = a === b ? 100 : a > b ? 0 : 1;
  }
}
