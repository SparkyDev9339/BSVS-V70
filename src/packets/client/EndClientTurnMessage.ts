import { ByteStream } from '../../misc/ByteStream';
import { CommandManager } from '../../Commands/CommandManager';
import { LogicCommand } from '../../Commands/LogicCommand';
import { ClientMessage } from './ClientMessage';

export class EndClientTurnMessage extends ClientMessage {
  readonly type = 14102;
  isCompressed = false;
  tick = 0;

  additionalData: number[] | null = null;
  commands: LogicCommand[] = [];
  unknownCommandType: number | null = null;
  private unknownCommandCount = 0;

  decode(stream: ByteStream): void {
    this.isCompressed = stream.readBoolean();
    this.tick = stream.readVInt();
    const count = stream.readVInt();
    if (count < 0 || count > 512)
      throw new Error(`Invalid command count ${count} (expected 0..512)`);
    this.commands = [];
    this.unknownCommandType = null;
    this.unknownCommandCount = 0;
    this.additionalData = null;
    for (let i = 0; i < count; i++) {
      const start = stream.offset;
      const command = CommandManager.decode(stream);
      if (!command) {
        stream.offset = start;
        this.unknownCommandType = stream.readVInt();
        stream.offset = start;
        this.unknownCommandCount = count - i;
        console.log(
          `[offline-v70] Unhandled command ${this.unknownCommandType}; remaining commands skipped`,
        );
        break;
      }
      this.commands.push(command);
    }

    if (this.unknownCommandCount === 0) this.additionalData = stream.readBytes();
    this.decodeTail(stream);
  }
  encode(stream: ByteStream): void {
    stream.writeBoolean(this.isCompressed);
    stream.writeVInt(this.tick);
    stream.writeVInt(this.commands.length + this.unknownCommandCount);
    for (const command of this.commands) CommandManager.encode(stream, command);
    if (this.unknownCommandCount === 0) stream.writeBytes(this.additionalData);
    this.encodeTail(stream);
  }
}
