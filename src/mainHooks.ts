import { Messaging } from './Messaging';
import { PiranhaMessage } from './piranhamessage';
import { offsets, layout } from './offsets';

const callbacks: NativeCallback<any, any>[] = [];
const bridges: CModule[] = [];
export function installHooks(
  base: NativePointer,
  messaging: Messaging,
  onError: (e: unknown) => void,
) {
  const O = offsets,
    L = layout;
  let initializedConnection = NULL;
  let tickFailed = false;
  function requireObject(pointer: NativePointer, label: string) {
    if (pointer.compare(NULL.add(0x10000)) < 0) {
      throw new Error(`Invalid ${label} pointer ${pointer}`);
    }
  }
  function readField<T>(
    pointer: NativePointer,
    label: string,
    offset: number,
    read: (field: NativePointer) => T,
  ): T {
    requireObject(pointer, label);
    try {
      return read(pointer.add(offset));
    } catch (error) {
      throw new Error(
        `Invalid ${label} pointer ${pointer}: cannot read field +${offset}: ${String(error)}`,
      );
    }
  }
  const send = new NativeCallback(
    (manager: NativePointer, message: NativePointer) => {
      try {
        messaging.handle(PiranhaMessage.type(message), PiranhaMessage.payload(message));
      } catch (e) {
        onError(e);
      } finally {
        if (!message.isNull()) PiranhaMessage.destroy(message);
      }
      return 1;
    },
    'int',
    ['pointer', 'pointer'],
  );
  const tick = new NativeCallback(
    (connection: NativePointer, dt: number) => {
      if (tickFailed) return NULL;
      try {
        const manager = base.add(O.MessageManagerInstance).readPointer();
        if (manager.isNull()) return NULL;

        const transport = readField(manager, 'MessageManager', L.managerMessaging, field =>
          field.readPointer(),
        );
        if (transport.isNull()) return NULL;

        readField(transport, 'Messaging', L.messagingFailed, field => field.readU8());
        readField(transport, 'Messaging', L.messagingState, field => field.readS32());
        const connectionState = readField(connection, 'ServerConnection', 0, field =>
          field.readS32(),
        );
        readField(connection, 'ServerConnection', L.connectionValidated, field => field.readU8());
        transport.add(L.messagingFailed).writeU8(0);
        transport.add(L.messagingState).writeS32(5);
        if (
          !initializedConnection.equals(connection) ||
          connectionState === 0 ||
          messaging.loginRequested
        ) {
          if (!messaging.prepare()) return NULL;
          initializedConnection = connection;
          connection.writeS32(4);
          connection.add(L.connectionValidated).writeU8(1);
          messaging.login();
        }
        messaging.flush(manager);
        return manager;
      } catch (e) {
        tickFailed = true;
        onError(e);
        return NULL;
      }
    },
    'pointer',
    ['pointer', 'float'],
  );
  callbacks.push(send, tick);
  Interceptor.replace(base.add(O.MessageManagerSend), send);

  const bridge = new CModule(
    `
    extern void *prepare(void *connection, float dt);
    extern void update(void *manager, float dt);
    void offline_tick(void *connection, float dt) {
      void *manager = prepare(connection, dt);
      if (manager) update(manager, dt);
    }
  `,
    { prepare: tick, update: base.add(O.MessageManagerUpdate) },
  );
  bridges.push(bridge);
  Interceptor.replace(base.add(O.ServerConnectionUpdate), bridge.offline_tick);

  Interceptor.attach(base.add(O.BattleScreenShouldShowChatButton), {
    onLeave(retval) {
      retval.replace(ptr(1));
    },
  });
  Interceptor.attach(base.add(O.StartGame), {
    onEnter(args) {
      args[3] = ptr(3);
    },
  });
}
