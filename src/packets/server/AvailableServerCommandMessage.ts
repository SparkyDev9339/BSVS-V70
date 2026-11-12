import { ByteStream } from '../../misc/ByteStream';
import { CommandManager } from '../../Commands/CommandManager';
import { LogicCommand } from '../../Commands/LogicCommand';

export class AvailableServerCommandMessage {
  readonly type = 24111;
  constructor(public command: LogicCommand | null = null) {}
  decode(stream: ByteStream): void {
    this.command = CommandManager.decode(stream, 'server');
  }
  encode(): number[] {
    if (!this.command) throw new Error('No server command');
    const stream = new ByteStream();
    CommandManager.encode(stream, this.command);
    return stream.payload;
  }
}
