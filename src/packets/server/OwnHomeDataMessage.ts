// Adapted from BSVS-V70 / BSL.v68 (Apache-2.0). See THIRD_PARTY_NOTICES.md.
import { ByteStream } from '../../misc/ByteStream';
import type { Config } from '../../config';
import { EventData } from '../../events/EventData';
import { BrawlPassSeasonData } from '../../home/BrawlPassSeasonData';

function writeVIntList(stream: ByteStream, values: readonly number[]): void {
  stream.writeVInt(values.length);
  for (const value of values) stream.writeVInt(value);
}

function writeSettings(stream: ByteStream, values: readonly (readonly [number, number])[]): void {
  stream.writeVInt(values.length);
  for (const [value, settingId] of values) stream.writeVLong(value, settingId);
}

function writeDailyData(stream: ByteStream, config: Config, skinIds: readonly number[]): void {
  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(100000);
  stream.writeVInt(100000);
  stream.writeVInt(100000);
  stream.writeVInt(454);
  stream.writeVInt(1488);

  stream.writeDataReference(28, config.thumbnail);
  stream.writeDataReference(43, config.nameColor);

  stream.writeVInt(94);
  for (let gameModeId = 0; gameModeId < 94; gameModeId++) {
    stream.writeVInt(gameModeId);
  }
  for (let i = 0; i < 6; i++) {
    const ids = [
      config.selectedSkins,
      config.skinRandomizer,
      config.currentRandomSkins,
      skinIds,
      [],
      [],
    ][i];
    stream.writeVInt(ids.length);
    for (const id of ids) stream.writeDataReference(29, id);
  }

  stream.writeVInt(0);
  stream.writeVInt(100000);
  stream.writeVInt(0);
  stream.writeVInt(1);
  stream.writeBoolean(true);

  stream.writeVInt(19500);
  stream.writeVInt(111111);
  stream.writeVInt(1375134);
  stream.writeVInt(0);
  stream.writeVInt(1375134);

  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);

  stream.writeBoolean(true);
  stream.writeVInt(2);
  stream.writeVInt(2);
  stream.writeVInt(2);
  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);

  stream.writeVInt(0);
  stream.writeVInt(200);
  stream.writeVInt(-1);
  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(-1);

  stream.writeByte(1);
  stream.writeDataReference(16, config.selectedBrawlers[0]);

  stream.writeString(config.country);
  stream.writeString(config.creator);

  writeSettings(stream, [
    [1, 9],
    [1, 22],
    [3, 25],
    [1, 24],
    [2, 15],
    [32447, 28],
    [100, 46],
    [1, 52],
  ]);

  stream.writeVInt(0);

  stream.writeVInt(config.brawlPass.enabled ? 1 : 0);
  if (config.brawlPass.enabled) {
    const pass = new BrawlPassSeasonData();
    pass.season = config.brawlPass.season;
    pass.points = config.brawlPass.points;
    pass.premium = config.brawlPass.premium;
    pass.encode(stream);
  }

  stream.writeBoolean(false);

  stream.writeBoolean(true);
  stream.writeVInt(0);
  stream.writeBoolean(false);

  stream.writeInt(0);
  stream.writeVInt(0);
  stream.writeDataReference(16, config.favouriteBrawler);
  stream.writeBoolean(false);

  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);

  stream.writeVInt(0);
  stream.writeVInt(0);

  stream.writeDataReference(2, 0);
  stream.writeDataReference(2, 0);
  stream.writeDataReference(2, 0);
  stream.writeDataReference(2, 0);

  stream.writeBoolean(false);
  stream.writeDataReference(2, 0);
  stream.writeVInt(770);
  stream.writeBoolean(false);
  stream.writeBoolean(false);
}

function writeConfData(stream: ByteStream, events: readonly EventData[], now: number): void {
  stream.writeVInt(events.length);
  for (const event of events) stream.writeVInt(event.slot);
  stream.writeVInt(events.length);
  for (const event of events) event.encode(stream, now);

  stream.writeVInt(0);
  stream.writeVInt(0);

  writeVIntList(stream, [20, 35, 75, 140, 290, 480, 800, 1250, 1875, 2800]);
  writeVIntList(stream, [30, 80, 170, 360]);
  writeVIntList(stream, [300, 880, 2040, 4680]);
  stream.writeVInt(0);

  writeSettings(stream, [
    [501, 10008],
    [0, 10046],
    [30, 10050],
    [0, 10051],
    [5600, 10060],
    [200, 117],
    [1, 128],
    [0, 65],
    [41000187, 1],
    [99999999, 131],
    [100000, 138],
    [1, 95],
    [55598, 47],
    [1, 123],
    [200, 124],
    [55598, 48],
    [3, 50],
    [500, 1100],
    [500, 1101],
    [1, 1002],
    [500, 1102],
  ]);

  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);

  writeVIntList(stream, [0, 29, 79, 169, 349, 699]);
  writeVIntList(stream, [0, 160, 450, 500, 1250, 2500]);
  writeVIntList(stream, [0, 100, 400, 1000, 3000]);

  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);
}

function writeClientHome(stream: ByteStream, config: Config): void {
  stream.writeLong(config.id[0], config.id[1]);
  stream.writeVInt(0);
  stream.writeVInt(-1);
  stream.writeBoolean(false);

  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);

  stream.writeBoolean(false);
  stream.writeBoolean(false);
  stream.writeBoolean(false);
  stream.writeBoolean(false);

  stream.writeVInt(0);
  stream.writeBoolean(false);
  stream.writeVInt(0);

  stream.writeDataReference(0);
  stream.writeDataReference(0);
  stream.writeDataReference(0);
  stream.writeDataReference(0);
  stream.writeDataReference(0);
  stream.writeDataReference(0);
  stream.writeBoolean(false);
  stream.writeBoolean(false);
  stream.writeBoolean(false);
  stream.writeBoolean(false);
  stream.writeBoolean(false);
  stream.writeVInt(0);

  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeInt(0);
  stream.writeBoolean(false);

  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeBoolean(false);

  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);

  stream.writeBoolean(false);
  stream.writeBoolean(false);
  stream.writeBoolean(false);
  stream.writeVInt(0);

  stream.writeBoolean(false);
  stream.writeBoolean(false);
  stream.writeBoolean(false);
  stream.writeBoolean(false);
  stream.writeBoolean(false);
  stream.writeBoolean(false);

  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeBoolean(false);
  stream.writeBoolean(false);
  stream.writeBoolean(false);
}

function writeClientAvatar(stream: ByteStream, config: Config): void {
  stream.writeVLong(config.id[0], config.id[1]);
  stream.writeVLong(config.id[0], config.id[1]);
  stream.writeVLong(0, 0);

  stream.writeStringReference(config.name);
  stream.writeBoolean(config.registered);
  stream.writeInt(-1);

  stream.writeVInt(35);
  for (let category = 0; category < 35; category++) {
    stream.writeVInt(0);
    const entries: Array<[number, number, number]> = [];
    if (category === 0) {
      for (const b of config.brawlers) entries.push([23, b.card, 1]);
      if (config.coins) entries.push([5, 8, config.coins]);
      if (config.bling) entries.push([5, 23, config.bling]);
    }
    if (category === 1 || category === 3) {
      for (const b of config.brawlers) if (b.trophies) entries.push([16, b.id, b.trophies]);
    }
    if (category === 5) {
      for (const b of config.brawlers) if (b.power > 1) entries.push([16, b.id, b.power - 1]);
    }
    stream.writeVInt(entries.length);
    for (const [type, id, value] of entries) {
      stream.writeDataReference(type, id);
      stream.writeVInt(-1);
      stream.writeVInt(value);
    }
  }

  stream.writeVInt(config.gems);
  stream.writeVInt(config.gems);
  stream.writeVInt(0);
  stream.writeVInt(100);
  stream.writeVInt(0);

  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(0);

  stream.writeVInt(2);
  stream.writeVInt(1);
  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeString(null);

  stream.writeVInt(0);
  stream.writeVInt(0);
  stream.writeVInt(2);
  stream.writeVInt(0);
  stream.writeBoolean(false);
  stream.writeBoolean(false);
}

export class OwnHomeDataMessage {
  static encode(
    config: Config,
    events: readonly EventData[] = [],
    now = Date.now(),
    skinIds: readonly number[] = [],
  ): number[] {
    const stream = new ByteStream();

    stream.writeVInt(0);
    stream.writeVInt(-1);

    writeDailyData(stream, config, skinIds);
    writeConfData(stream, events, now);
    writeClientHome(stream, config);
    writeClientAvatar(stream, config);

    return stream.payload;
  }
}
