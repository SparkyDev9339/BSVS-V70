import { platformOffsets } from '../../offsets';

export function replaceBotTick(base: NativePointer, paused: (hero: NativePointer) => boolean) {
  const address = base.add(platformOffsets.knockout.botTick);
  const original = new NativeFunction(address, 'void', ['pointer']);
  const callback = new NativeCallback(
    (bot: NativePointer) => {
      if (!paused(bot.add(48).readPointer())) original(bot);
    },
    'void',
    ['pointer'],
  );
  Interceptor.replace(address, callback);
  return callback;
}
