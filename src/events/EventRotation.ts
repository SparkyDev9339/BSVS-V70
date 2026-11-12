import settings from '../../config/events.json';
import type { InventoryRow } from '../battle/Inventory';
import { EventData } from './EventData';

export class EventRotation {
  constructor(
    private readonly locations: readonly InventoryRow[],
    private readonly modes: readonly InventoryRow[],
    private readonly config = settings,
  ) {
    if (
      !Number.isInteger(config.rotationHours) ||
      config.rotationHours < 1 ||
      config.rotationHours > 168 ||
      !Number.isInteger(config.refreshHourUtc) ||
      config.refreshHourUtc < 0 ||
      config.refreshHourUtc > 23
    )
      throw new Error('Invalid event rotation period');
    const ids = new Set<number>();
    for (const { slot, modes: allowed } of config.slots) {
      if (!Number.isInteger(slot) || slot < 1 || slot > 38 || ids.has(slot) || !allowed.length)
        throw new Error('Invalid event slot');
      ids.add(slot);
      for (const mode of allowed)
        if (!this.pool(mode).length) throw new Error(`No enabled maps for ${mode} in slot ${slot}`);
    }
  }
  private pool(mode: string): InventoryRow[] {
    if (!this.modes.some(row => row.values.Name === mode && row.values.Disabled !== '1')) return [];
    let rows = this.locations.filter(
      row =>
        row.values.Disabled !== '1' && row.values.GameModeVariation === mode && !!row.values.Map,
    );
    if (mode === 'Showdown' || mode === 'DuoShowdown') {
      const counterpart = mode === 'Showdown' ? 'DuoShowdown' : 'Showdown';
      const maps = new Set(
        this.locations
          .filter(
            row => row.values.Disabled !== '1' && row.values.GameModeVariation === counterpart,
          )
          .map(row => row.values.Map),
      );
      rows = rows.filter(row => maps.has(row.values.Map));
    }

    rows.sort((a, b) =>
      a.values.Map < b.values.Map ? -1 : a.values.Map > b.values.Map ? 1 : a.id - b.id,
    );
    return rows.filter((row, i) => i === 0 || row.values.Map !== rows[i - 1].values.Map);
  }
  generate(now = Date.now()): EventData[] {
    const duration = this.config.rotationHours * 3600000;
    const origin = this.config.refreshHourUtc * 3600000;
    const period = Math.floor((now - origin) / duration);
    const start = origin + period * duration;
    const mod = (value: number, size: number) => ((value % size) + size) % size;
    return this.config.slots.map(({ slot, modes }) => {
      const mode = modes[mod(period, modes.length)];
      const pool = this.pool(mode);
      const turn = Math.floor(period / modes.length);
      const row = pool[mod(turn, pool.length)];
      return new EventData(slot, row.id, start, start + duration, mode);
    });
  }
}
