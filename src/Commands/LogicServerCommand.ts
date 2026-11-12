import { LogicCommand } from './LogicCommand';
import { ByteStream } from '../misc/ByteStream';

export abstract class LogicServerCommand extends LogicCommand {
  sequence = 0;
  decode(stream: ByteStream): void {
    this.sequence = stream.readVInt();
    super.decode(stream);
  }
  encode(stream: ByteStream): void {
    stream.writeVInt(this.sequence);
    super.encode(stream);
  }
}
