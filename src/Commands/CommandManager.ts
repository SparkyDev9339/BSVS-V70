import { Config } from '../config';
import { ByteStream } from '../misc/ByteStream';
import { LogicHeroSeenCommand } from './Home/LogicHeroSeenCommand';
import { LogicSelectSkinCommand } from './Home/LogicSelectSkinCommand';
import { LogicCommand, type SelectionCatalog } from './LogicCommand';
import { LogicSelectCharacterCommand } from './Home/LogicSelectCharacterCommand';
import { LogicSelectFavouriteHeroCommand } from './Home/LogicSelectFavouriteHeroCommand';
import { LogicSetPlayerThumbnailCommand } from './Home/LogicSetPlayerThumbnailCommand';
import { LogicSetPlayerNameColorCommand } from './Home/LogicSetPlayerNameColorCommand';
import { LogicChangeAvatarNameCommand } from './Avatar/LogicChangeAvatarNameCommand';
import { LogicSetSupportedCreatorCommand } from './Home/LogicSetSupportedCreatorCommand';

const clientCommands = new Map<number, new () => LogicCommand>([
  [522, LogicHeroSeenCommand],
  [505, LogicSetPlayerThumbnailCommand],
  [506, LogicSelectSkinCommand],
  [525, LogicSelectCharacterCommand],
  [527, LogicSetPlayerNameColorCommand],
  [570, LogicSelectFavouriteHeroCommand],
]);
const serverCommands = new Map<number, new () => LogicCommand>([
  [201, LogicChangeAvatarNameCommand],
  [215, LogicSetSupportedCreatorCommand],
]);

export class CommandManager {
  static decode(
    stream: ByteStream,
    direction: 'client' | 'server' = 'client',
  ): LogicCommand | null {
    const type = stream.readVInt();
    const Constructor = (direction === 'client' ? clientCommands : serverCommands).get(type);
    if (!Constructor) return null;
    const command = new Constructor();
    command.decode(stream);
    return command;
  }
  static encode(stream: ByteStream, command: LogicCommand): void {
    stream.writeVInt(command.type);
    command.encode(stream);
  }
  static execute(
    commands: readonly LogicCommand[],
    profile: Config,
    catalog?: SelectionCatalog,
  ): boolean {
    const next: Config = JSON.parse(JSON.stringify(profile));
    let changed = false;
    for (const command of commands) changed = command.execute(next, catalog) || changed;
    if (changed) Object.assign(profile, next);
    return changed;
  }
}
