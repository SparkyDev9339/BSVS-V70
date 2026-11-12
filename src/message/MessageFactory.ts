import { ByteStream } from '../misc/ByteStream';
import { ClientHelloMessage } from '../packets/client/ClientHelloMessage';
import { AuthenticationMessage } from '../packets/client/AuthenticationMessage';
import { KeepAliveMessage } from '../packets/client/KeepAliveMessage';
import { GoHomeMessage } from '../packets/client/GoHomeMessage';
import { GoHomeFromOfflinePractiseMessage } from '../packets/client/GoHomeFromOfflinePractiseMessage';
import { GoHomeFromMapEditorMessage } from '../packets/client/GoHomeFromMapEditorMessage';
import { AskForBattleEndMessage } from '../packets/client/AskForBattleEndMessage';
import { EndClientTurnMessage } from '../packets/client/EndClientTurnMessage';
import { AvatarNameCheckMessage } from '../packets/client/AvatarNameCheckMessage';
import { ChangeAvatarNameMessage } from '../packets/client/ChangeAvatarNameMessage';
import { SetSupportedCreatorMessage } from '../packets/client/SetSupportedCreatorMessage';
import { GetPlayerProfileMessage } from '../packets/client/GetPlayerProfileMessage';

export type IncomingMessage =
  | ClientHelloMessage
  | AuthenticationMessage
  | KeepAliveMessage
  | GoHomeMessage
  | GoHomeFromOfflinePractiseMessage
  | GoHomeFromMapEditorMessage
  | AskForBattleEndMessage
  | EndClientTurnMessage
  | AvatarNameCheckMessage
  | ChangeAvatarNameMessage
  | SetSupportedCreatorMessage
  | GetPlayerProfileMessage;

const messages = new Map<number, new () => IncomingMessage>([
  [10100, ClientHelloMessage],
  [10101, AuthenticationMessage],
  [10108, KeepAliveMessage],
  [14101, GoHomeMessage],
  [17750, GoHomeFromOfflinePractiseMessage],
  [12108, GoHomeFromMapEditorMessage],
  [14110, AskForBattleEndMessage],
  [14102, EndClientTurnMessage],
  [14600, AvatarNameCheckMessage],
  [10212, ChangeAvatarNameMessage],
  [18686, SetSupportedCreatorMessage],
  [15081, GetPlayerProfileMessage],
]);

export class MessageFactory {
  static decode(type: number, payload: number[]): IncomingMessage | null {
    const Constructor = messages.get(type);
    if (!Constructor) return null;
    try {
      const message = new Constructor();
      message.decode(new ByteStream(payload));
      return message;
    } catch (error) {
      throw new Error(`Failed to decode message ${type}: ${String(error)}`);
    }
  }
}
