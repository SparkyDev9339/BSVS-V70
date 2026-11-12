const iosUuid = 'aa6562966bec475e83dd93f53a143049';

const battleRosterAddPlayer = 0xbf11fc;
const battleRosterResetStats = 0xbfd61c;
const battleRosterSetString = 0xe762bc;

const hotzoneCreateArea = 0xb1ce74;
const hotzoneLinkArea = 0xb1cd44;
const hotzoneSetPosition = 0xb598ac;
const hotzoneAddObject = 0xb52c40;
const hotzoneTriggerArea = 0xb1cee0;
const hotzoneAreaRadius = 0xb1f098;
const hotzoneBattleTicks = 0xc26f00;
const hotzoneHasModifier = 0xbf1b7c;

const turretTriggerAreaEffect = 0xb29584;

const chargeActivateSkill = 0xb33efc;
const chargeSetPath = 0xb39e38;
const chargeDirectPath = 0xb41d04;
const chargePathLength = 0xc29d60;
const chargeDestroyEnvironment = 0xa605ac;

const knockoutConstructor = 0xbefbfc;
const knockoutDestructor = 0xbefc00;
const knockoutControlStart = 0xbf3be8;
const knockoutUpdatePositions = 0xbf0f1c;
const knockoutStep = 0xbf07e0;
const knockoutIsGameOver = 0xbf32e4;
const knockoutSpawnCharacter = 0xbf1e6c;
const knockoutClearObjects = 0xb51c94;
const knockoutFindObject = 0xb53130;
const knockoutResetMap = 0xbf6b2c;
const knockoutArrangePlayers = 0xbf6bc4;
const knockoutTickObjects = 0xb51da4;
const knockoutCalculateMovement = 0xb3bb54;
const knockoutBotTick = 0xb8032c;
const knockoutAppendPointer = 0x5092b8;

const offsetsBattleScreenShouldShowChatButton = 0x08c0614;
const offsetsServerConnectionUpdate = 0x874f58;
const offsetsServerConnectionInstance = 0x1273da0;
const offsetsMessageManagerInstance = 0x1273d60;
const offsetsMessageManagerSend = 0x86a168;
const offsetsMessageManagerUpdate = 0x870c98;
const offsetsMessageManagerReceiveOwned = 0x871b38;
const offsetsCreateMessageByType = 0xb9f2e4;
const offsetsByteStreamSetBuffer = 0xd36608;
const offsetsOperatorNew = 0xec76bc;
const offsetsOperatorNewArray = 0xec76b0;
const offsetsOwnHomeDataDecode = 0xbd1b00;
const offsetsStartGame = 0x98c2a4;
const offsetsGetTable = 0xacc824;
const offsetsTableCount = 0xacafa8;
const offsetsTableItem = 0xacb1a8;
const offsetsDataName = 0xac75d8;
const offsetsRowString = 0xd33aac;

const layoutMessageType = 40;
const layoutEncode = 16;
const layoutDecode = 24;
const layoutDestruct = 56;
const layoutDelete = 8;
const layoutMessageVersion = 136;
const layoutByteStream = 8;
const layoutStreamOffset = 20;
const layoutStreamSize = 24;
const layoutStreamBuffer = 56;
const layoutManagerMessaging = 112;
const layoutConnectionMessaging = 8;
const layoutMessagingFactory = 424;
const layoutMessagingFailed = 8;
const layoutMessagingState = 24;
const layoutConnectionValidated = 205;

export const ios = {
  uuid: iosUuid,
  battleRoster: {
    addPlayer: battleRosterAddPlayer,
    resetStats: battleRosterResetStats,
    setString: battleRosterSetString,
  },
  hotzone: {
    createArea: hotzoneCreateArea,
    linkArea: hotzoneLinkArea,
    setPosition: hotzoneSetPosition,
    addObject: hotzoneAddObject,
    triggerArea: hotzoneTriggerArea,
    areaRadius: hotzoneAreaRadius,
    battleTicks: hotzoneBattleTicks,
    hasModifier: hotzoneHasModifier,
  },
  turret: {
    triggerAreaEffect: turretTriggerAreaEffect,
  },
  charge: {
    activateSkill: chargeActivateSkill,
    setPath: chargeSetPath,
    directPath: chargeDirectPath,
    pathLength: chargePathLength,
    destroyEnvironment: chargeDestroyEnvironment,
  },
  knockout: {
    constructor: knockoutConstructor,
    destructor: knockoutDestructor,
    controlStart: knockoutControlStart,
    updatePositions: knockoutUpdatePositions,
    step: knockoutStep,
    isGameOver: knockoutIsGameOver,
    spawnCharacter: knockoutSpawnCharacter,
    clearObjects: knockoutClearObjects,
    findObject: knockoutFindObject,
    resetMap: knockoutResetMap,
    arrangePlayers: knockoutArrangePlayers,
    tickObjects: knockoutTickObjects,
    calculateMovement: knockoutCalculateMovement,
    botTick: knockoutBotTick,
    appendPointer: knockoutAppendPointer,
  },
  offsets: {
    BattleScreenShouldShowChatButton: offsetsBattleScreenShouldShowChatButton,
    ServerConnectionUpdate: offsetsServerConnectionUpdate,
    ServerConnectionInstance: offsetsServerConnectionInstance,
    MessageManagerInstance: offsetsMessageManagerInstance,
    MessageManagerSend: offsetsMessageManagerSend,
    MessageManagerUpdate: offsetsMessageManagerUpdate,
    MessageManagerReceiveOwned: offsetsMessageManagerReceiveOwned,
    CreateMessageByType: offsetsCreateMessageByType,
    ByteStreamSetBuffer: offsetsByteStreamSetBuffer,
    OperatorNew: offsetsOperatorNew,
    OperatorNewArray: offsetsOperatorNewArray,
    OwnHomeDataDecode: offsetsOwnHomeDataDecode,
    StartGame: offsetsStartGame,
    GetTable: offsetsGetTable,
    TableCount: offsetsTableCount,
    TableItem: offsetsTableItem,
    DataName: offsetsDataName,
    RowString: offsetsRowString,
  },
  layout: {
    messageType: layoutMessageType,
    encode: layoutEncode,
    decode: layoutDecode,
    destruct: layoutDestruct,
    delete: layoutDelete,
    messageVersion: layoutMessageVersion,
    byteStream: layoutByteStream,
    streamOffset: layoutStreamOffset,
    streamSize: layoutStreamSize,
    streamBuffer: layoutStreamBuffer,
    managerMessaging: layoutManagerMessaging,
    connectionMessaging: layoutConnectionMessaging,
    messagingFactory: layoutMessagingFactory,
    messagingFailed: layoutMessagingFailed,
    messagingState: layoutMessagingState,
    connectionValidated: layoutConnectionValidated,
  },
} as const;

type PlatformOffsets<T> = {
  [K in keyof T]: T[K] extends number
    ? number
    : T[K] extends string
      ? string
      : PlatformOffsets<T[K]>;
};

export const android: PlatformOffsets<typeof ios> | null = null;

const isAndroid = typeof Process !== 'undefined' && Process.platform === 'linux';
const selected = isAndroid ? android : ios;
if (!selected)
  throw new Error('Android offsets are not configured. This build currently supports iOS ARM64.');

export const platformOffsets = selected;
export const offsets = selected.offsets;
export const layout = selected.layout;
export const imageUuid = selected.uuid;

export function nativeFunctions(base: NativePointer) {
  const bind = <R extends NativeFunctionReturnType, const A extends NativeFunctionArgumentType[]>(
    offset: number,
    result: R,
    args: A,
  ) => {
    const create = () => new NativeFunction(base.add(offset), result, args);
    let native: ReturnType<typeof create> | undefined;
    return (...values: Parameters<ReturnType<typeof create>>) => {
      native ??= create();
      return native(...values);
    };
  };
  const O = platformOffsets.offsets;
  return {
    messaging: {
      create: bind(O.CreateMessageByType, 'pointer', ['pointer', 'int']),
      allocate: bind(O.OperatorNewArray, 'pointer', ['ulong']),
      setBuffer: bind(O.ByteStreamSetBuffer, 'void', ['pointer', 'pointer', 'int']),
      receive: bind(O.MessageManagerReceiveOwned, 'void', ['pointer', 'pointer']),
    },
    table: {
      get: bind(O.GetTable, 'pointer', ['int']),
      item: bind(O.TableItem, 'pointer', ['pointer', 'int']),
    },
    battleRoster: {
      resetStats: bind(platformOffsets.battleRoster.resetStats, 'void', ['pointer']),
      setName: bind(platformOffsets.battleRoster.setString, 'void', ['pointer', 'pointer']),
    },
    hotzone: {
      create: bind(platformOffsets.hotzone.createArea, 'pointer', ['pointer', 'pointer']),
      position: bind(platformOffsets.hotzone.setPosition, 'void', ['pointer', 'int', 'int', 'int']),
      add: bind(platformOffsets.hotzone.addObject, 'void', ['pointer', 'pointer']),
      trigger: bind(platformOffsets.hotzone.triggerArea, 'void', ['pointer']),
      radius: bind(platformOffsets.hotzone.areaRadius, 'int', ['pointer']),
      duration: bind(platformOffsets.hotzone.battleTicks, 'int', ['pointer']),
      modifier: bind(platformOffsets.hotzone.hasModifier, 'bool', ['pointer', 'int']),
    },
    turret: {
      createAura: bind(platformOffsets.turret.triggerAreaEffect, 'pointer', [
        'pointer',
        'pointer',
        'int',
        'int',
        'int',
        'int',
        'pointer',
      ]),
    },
    charge: {
      setPath: bind(platformOffsets.charge.setPath, 'int', [
        'pointer',
        'int',
        'int',
        'int',
        'int',
        'int',
        'char',
      ]),
      directPath: bind(platformOffsets.charge.directPath, 'void', [
        'pointer',
        'int',
        'int',
        'pointer',
      ]),
      pathLength: bind(platformOffsets.charge.pathLength, 'int', ['pointer', 'pointer']),
      destroyEnvironment: bind(platformOffsets.charge.destroyEnvironment, 'int', [
        'pointer',
        'int',
        'int',
        'int',
        'int',
        'int',
        'int',
        'int',
        'char',
        'pointer',
      ]),
    },
    knockout: {
      controlStart: bind(platformOffsets.knockout.controlStart, 'int', ['pointer']),
      findObject: bind(platformOffsets.knockout.findObject, 'pointer', ['pointer', 'int']),
      clearObjects: bind(platformOffsets.knockout.clearObjects, 'void', ['pointer']),
      resetMap: bind(platformOffsets.knockout.resetMap, 'void', ['pointer', 'int', 'int']),
      arrange: bind(platformOffsets.knockout.arrangePlayers, 'void', [
        'pointer',
        'int',
        'pointer',
        'pointer',
        'pointer',
        'pointer',
      ]),
      spawn: bind(platformOffsets.knockout.spawnCharacter, 'pointer', [
        'pointer',
        'pointer',
        'pointer',
        'pointer',
        'uint',
        'uint',
        'int',
        'char',
        'uint',
        'uint',
        'uint',
        'uchar',
        'uchar',
      ]),
      updatePositions: bind(platformOffsets.knockout.updatePositions, 'void', ['pointer']),
      appendPointer: bind(platformOffsets.knockout.appendPointer, 'void', ['pointer', 'pointer']),
    },
  };
}
