import type { Config } from '../config';
import { CommandManager } from '../Commands/CommandManager';
import { LogicChangeAvatarNameCommand } from '../Commands/Avatar/LogicChangeAvatarNameCommand';
import { LogicSetSupportedCreatorCommand } from '../Commands/Home/LogicSetSupportedCreatorCommand';
import { AvailableServerCommandMessage } from '../packets/server/AvailableServerCommandMessage';
import { AvatarNameCheckResponseMessage } from '../packets/server/AvatarNameCheckResponseMessage';
import { MessageFactory, IncomingMessage } from './MessageFactory';
import type { ClientHelloMessage } from '../packets/client/ClientHelloMessage';
import type { AuthenticationMessage } from '../packets/client/AuthenticationMessage';
import type { KeepAliveMessage } from '../packets/client/KeepAliveMessage';
import type { GoHomeMessage } from '../packets/client/GoHomeMessage';
import type { GoHomeFromOfflinePractiseMessage } from '../packets/client/GoHomeFromOfflinePractiseMessage';
import type { GoHomeFromMapEditorMessage } from '../packets/client/GoHomeFromMapEditorMessage';
import type { AskForBattleEndMessage } from '../packets/client/AskForBattleEndMessage';
import type { EndClientTurnMessage } from '../packets/client/EndClientTurnMessage';
import type { AvatarNameCheckMessage } from '../packets/client/AvatarNameCheckMessage';
import type { ChangeAvatarNameMessage } from '../packets/client/ChangeAvatarNameMessage';
import type { SetSupportedCreatorMessage } from '../packets/client/SetSupportedCreatorMessage';
import type { GetPlayerProfileMessage } from '../packets/client/GetPlayerProfileMessage';
import { BattleEndMessage } from '../packets/server/BattleEndMessage';
import { PlayerProfileMessage } from '../packets/server/PlayerProfileMessage';

import type { SelectionCatalog } from '../Commands/LogicCommand';

export interface MessageConnection {
  readonly selectionCatalog?: SelectionCatalog;
  readonly config: Config;
  save(): void;
  send(type: number, payload: number[]): void;
  sendHome(): void;
  authenticate(id: readonly number[], token: string | null): void;
  getProfile(id: readonly number[]): Config | null;
  prepareBattleResult?(message: AskForBattleEndMessage, variation: number): AskForBattleEndMessage;
  getBattleMode?(location: readonly number[]): number;
  getBattleVariation?(location: readonly number[]): number;
}

export class MessageManager {
  lastActivity = Date.now();
  lastUnhandled: number | null = null;
  constructor(private readonly connection: MessageConnection) {}

  handle(type: number, payload: number[]) {
    this.lastActivity = Date.now();
    const message = MessageFactory.decode(type, payload);
    if (!message) {
      this.lastUnhandled = type;
      console.log(`[offline-v70] Unsupported message ${type}`);
      return;
    }
    this.receiveMessage(message);
  }

  receiveMessage(message: IncomingMessage): void {
    switch (message.type) {
      case 10100:
        return this.clientHelloReceived(message);
      case 10101:
        return this.loginReceived(message);
      case 10108:
        return this.keepAliveReceived(message);
      case 14101:
        return this.goHomeReceived(message);
      case 17750:
        return this.goHomeFromOfflinePractiseReceived(message);
      case 12108:
        return this.goHomeFromMapEditorReceived(message);
      case 14110:
        return this.askForBattleEndReceived(message);
      case 14102:
        return this.endClientTurnReceived(message);
      case 14600:
        return this.avatarNameCheckReceived(message);
      case 10212:
        return this.changeNameReceived(message);
      case 18686:
        return this.setSupportedCreatorReceived(message);
      case 15081:
        return this.getPlayerProfileReceived(message);
      default: {
        const unhandled: never = message;
        throw new Error(`Missing message handler: ${String(unhandled)}`);
      }
    }
  }

  private clientHelloReceived(_message: ClientHelloMessage) {}
  private loginReceived(message: AuthenticationMessage) {
    this.connection.authenticate(message.accountId, message.passToken);
  }
  private keepAliveReceived(_message: KeepAliveMessage) {}
  private goHomeReceived(_message: GoHomeMessage) {
    this.connection.sendHome();
  }
  private goHomeFromOfflinePractiseReceived(_message: GoHomeFromOfflinePractiseMessage) {
    this.connection.sendHome();
  }
  private goHomeFromMapEditorReceived(_message: GoHomeFromMapEditorMessage) {
    this.connection.sendHome();
  }
  private askForBattleEndReceived(message: AskForBattleEndMessage) {
    const variation = this.connection.getBattleVariation?.(message.location) ?? 0;
    const result = this.connection.prepareBattleResult?.(message, variation) ?? message;
    const response = new BattleEndMessage(
      result,
      this.connection.config,
      this.connection.getBattleMode?.(message.location) ?? 1,
      variation,
    );
    this.connection.send(response.type, response.encode());
  }
  private endClientTurnReceived(message: EndClientTurnMessage) {
    if (
      CommandManager.execute(
        message.commands,
        this.connection.config,
        this.connection.selectionCatalog,
      )
    )
      this.connection.save();
  }
  private avatarNameCheckReceived(message: AvatarNameCheckMessage) {
    const response = new AvatarNameCheckResponseMessage(message.name);
    this.connection.send(response.type, response.encode());
  }
  private changeNameReceived(message: ChangeAvatarNameMessage) {
    const { name } = message;
    if (!name || !name.trim() || name.length > 32) return;
    const command = new LogicChangeAvatarNameCommand(name);
    command.execute(this.connection.config);
    this.connection.save();
    const response = new AvailableServerCommandMessage(command);
    this.connection.send(response.type, response.encode());
  }
  private setSupportedCreatorReceived(message: SetSupportedCreatorMessage) {
    const command = new LogicSetSupportedCreatorCommand(message.code);
    if (command.execute(this.connection.config)) this.connection.save();
    const response = new AvailableServerCommandMessage(
      new LogicSetSupportedCreatorCommand(this.connection.config.creator),
    );
    this.connection.send(response.type, response.encode());
  }
  private getPlayerProfileReceived(message: GetPlayerProfileMessage) {
    const id = message.accountId.every(n => n === 0)
      ? this.connection.config.id
      : message.accountId;
    const profile = this.connection.getProfile(id);
    if (!profile) {
      console.log(`[offline-v70] Local profile ${id.join(':')} not found`);
      return;
    }
    const response = new PlayerProfileMessage(profile, this.connection.selectionCatalog?.skins);
    this.connection.send(response.type, response.encode());
  }
}
