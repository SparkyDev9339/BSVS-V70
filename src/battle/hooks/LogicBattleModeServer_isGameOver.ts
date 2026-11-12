import { platformOffsets } from '../../offsets';
import type { BattleSession } from './LogicBattleModeServer_tick';

export function replaceIsGameOver(
  base: NativePointer,
  getSession: (battle: NativePointer) => BattleSession | undefined,
) {
  const address = base.add(platformOffsets.knockout.isGameOver);
  const original = new NativeFunction(address, 'int', ['pointer']);
  const callback = new NativeCallback(
    (battle: NativePointer) => {
      const state = getSession(battle);
      if (state?.hotzone && !state.failed)
        return state.hotzone.match.winner !== null ||
          battle.add(161).readU8() !== 0 ||
          battle.add(249).readU8() !== 0
          ? 1
          : 0;
      if (!state?.match || state.failed) return original(battle);

      return state.match.phase === 'finished' ||
        battle.add(161).readU8() !== 0 ||
        battle.add(249).readU8() !== 0
        ? 1
        : 0;
    },
    'int',
    ['pointer'],
  );
  Interceptor.replace(address, callback);
  return callback;
}
