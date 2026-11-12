import { nativeFunctions, platformOffsets } from '../../offsets';
import type { OfflineBattleResults } from '../OfflineBattleResults';
import { battleRoster } from '../BattleRoster';

export class LogicBattleModeServerAddPlayer {
  private hook: InvocationListener;
  constructor(
    base: NativePointer,
    onError: (error: unknown) => void,
    results?: OfflineBattleResults,
  ) {
    const native = nativeFunctions(base);
    const getTable = native.table.get;
    const item = native.table.item;
    const resetStats = native.battleRoster.resetStats;
    const setName = native.battleRoster.setName;
    const name = Memory.allocUtf8String(battleRoster.name);
    this.hook = Interceptor.attach(base.add(platformOffsets.battleRoster.addPlayer), {
      onEnter(args) {
        this.battle = args[0];
        this.offline = false;
        try {
          if (args[0].add(240).readU8() !== 1) return;
          this.offline = true;

          if (this.context.sp.readU8() === 0) return;
          const table = getTable(battleRoster.character[0]);
          if (table.isNull()) throw new Error('Character table is not loaded');
          const shelly = item(table, battleRoster.character[1]);
          if (shelly.isNull()) throw new Error('Shelly is missing from the character table');
          if (!args[2].equals(shelly) && !args[3].isNull()) {
            const power = args[3].readS32();
            resetStats(args[3]);
            args[3].writeS32(power);
          }
          args[2] = shelly;

          this.context.sp.add(8).writePointer(NULL);
          if (!args[7].isNull()) setName(args[7], name);
        } catch (error) {
          onError(error);
        }
      },
      onLeave(player) {
        if (!results || !this.offline || player.isNull()) return;
        try {
          const battle = this.battle as NativePointer;
          results.record(
            battle.toString(),
            battle.add(220).readS32(),
            player.add(104).readS32(),
            player.add(108).readS32(),
            player.add(169).readU8() !== 0,
          );
        } catch (error) {
          onError(error);
        }
      },
    });
  }
}
