"use strict";
(() => {
  // src/offsets.ts
  var iosUuid = "aa6562966bec475e83dd93f53a143049";
  var battleRosterAddPlayer = 12521980;
  var battleRosterResetStats = 12572188;
  var battleRosterSetString = 15164092;
  var hotzoneCreateArea = 11652724;
  var hotzoneLinkArea = 11652420;
  var hotzoneSetPosition = 11901100;
  var hotzoneAddObject = 11873344;
  var hotzoneTriggerArea = 11652832;
  var hotzoneAreaRadius = 11661464;
  var hotzoneBattleTicks = 12742400;
  var hotzoneHasModifier = 12524412;
  var turretTriggerAreaEffect = 11703684;
  var chargeActivateSkill = 11747068;
  var chargeSetPath = 11771448;
  var chargeDirectPath = 11803908;
  var chargePathLength = 12754272;
  var chargeDestroyEnvironment = 10880428;
  var knockoutConstructor = 12516348;
  var knockoutDestructor = 12516352;
  var knockoutControlStart = 12532712;
  var knockoutUpdatePositions = 12521244;
  var knockoutStep = 12519392;
  var knockoutIsGameOver = 12530404;
  var knockoutSpawnCharacter = 12525164;
  var knockoutClearObjects = 11869332;
  var knockoutFindObject = 11874608;
  var knockoutResetMap = 12544812;
  var knockoutArrangePlayers = 12544964;
  var knockoutTickObjects = 11869604;
  var knockoutCalculateMovement = 11778900;
  var knockoutBotTick = 12059436;
  var knockoutAppendPointer = 5280440;
  var offsetsBattleScreenShouldShowChatButton = 9176596;
  var offsetsServerConnectionUpdate = 8867672;
  var offsetsServerConnectionInstance = 19348896;
  var offsetsMessageManagerInstance = 19348832;
  var offsetsMessageManagerSend = 8823144;
  var offsetsMessageManagerUpdate = 8850584;
  var offsetsMessageManagerReceiveOwned = 8854328;
  var offsetsCreateMessageByType = 12186340;
  var offsetsByteStreamSetBuffer = 13854216;
  var offsetsOperatorNew = 15496892;
  var offsetsOperatorNewArray = 15496880;
  var offsetsOwnHomeDataDecode = 12393216;
  var offsetsStartGame = 10011300;
  var offsetsGetTable = 11323428;
  var offsetsTableCount = 11317160;
  var offsetsTableItem = 11317672;
  var offsetsDataName = 11302360;
  var offsetsRowString = 13843116;
  var layoutMessageType = 40;
  var layoutEncode = 16;
  var layoutDecode = 24;
  var layoutDestruct = 56;
  var layoutDelete = 8;
  var layoutMessageVersion = 136;
  var layoutByteStream = 8;
  var layoutStreamOffset = 20;
  var layoutStreamSize = 24;
  var layoutStreamBuffer = 56;
  var layoutManagerMessaging = 112;
  var layoutConnectionMessaging = 8;
  var layoutMessagingFactory = 424;
  var layoutMessagingFailed = 8;
  var layoutMessagingState = 24;
  var layoutConnectionValidated = 205;
  var ios = {
    uuid: iosUuid,
    battleRoster: {
      addPlayer: battleRosterAddPlayer,
      resetStats: battleRosterResetStats,
      setString: battleRosterSetString
    },
    hotzone: {
      createArea: hotzoneCreateArea,
      linkArea: hotzoneLinkArea,
      setPosition: hotzoneSetPosition,
      addObject: hotzoneAddObject,
      triggerArea: hotzoneTriggerArea,
      areaRadius: hotzoneAreaRadius,
      battleTicks: hotzoneBattleTicks,
      hasModifier: hotzoneHasModifier
    },
    turret: {
      triggerAreaEffect: turretTriggerAreaEffect
    },
    charge: {
      activateSkill: chargeActivateSkill,
      setPath: chargeSetPath,
      directPath: chargeDirectPath,
      pathLength: chargePathLength,
      destroyEnvironment: chargeDestroyEnvironment
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
      appendPointer: knockoutAppendPointer
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
      RowString: offsetsRowString
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
      connectionValidated: layoutConnectionValidated
    }
  };
  var android = null;
  var isAndroid = typeof Process !== "undefined" && Process.platform === "linux";
  var selected = isAndroid ? android : ios;
  if (!selected)
    throw new Error("Android offsets are not configured. This build currently supports iOS ARM64.");
  var platformOffsets = selected;
  var offsets = selected.offsets;
  var layout = selected.layout;
  var imageUuid = selected.uuid;
  function nativeFunctions(base) {
    const bind = (offset, result, args) => {
      const create = () => new NativeFunction(base.add(offset), result, args);
      let native;
      return (...values) => {
        native ??= create();
        return native(...values);
      };
    };
    const O = platformOffsets.offsets;
    return {
      messaging: {
        create: bind(O.CreateMessageByType, "pointer", ["pointer", "int"]),
        allocate: bind(O.OperatorNewArray, "pointer", ["ulong"]),
        setBuffer: bind(O.ByteStreamSetBuffer, "void", ["pointer", "pointer", "int"]),
        receive: bind(O.MessageManagerReceiveOwned, "void", ["pointer", "pointer"])
      },
      table: {
        get: bind(O.GetTable, "pointer", ["int"]),
        item: bind(O.TableItem, "pointer", ["pointer", "int"])
      },
      battleRoster: {
        resetStats: bind(platformOffsets.battleRoster.resetStats, "void", ["pointer"]),
        setName: bind(platformOffsets.battleRoster.setString, "void", ["pointer", "pointer"])
      },
      hotzone: {
        create: bind(platformOffsets.hotzone.createArea, "pointer", ["pointer", "pointer"]),
        position: bind(platformOffsets.hotzone.setPosition, "void", ["pointer", "int", "int", "int"]),
        add: bind(platformOffsets.hotzone.addObject, "void", ["pointer", "pointer"]),
        trigger: bind(platformOffsets.hotzone.triggerArea, "void", ["pointer"]),
        radius: bind(platformOffsets.hotzone.areaRadius, "int", ["pointer"]),
        duration: bind(platformOffsets.hotzone.battleTicks, "int", ["pointer"]),
        modifier: bind(platformOffsets.hotzone.hasModifier, "bool", ["pointer", "int"])
      },
      turret: {
        createAura: bind(platformOffsets.turret.triggerAreaEffect, "pointer", [
          "pointer",
          "pointer",
          "int",
          "int",
          "int",
          "int",
          "pointer"
        ])
      },
      charge: {
        setPath: bind(platformOffsets.charge.setPath, "int", [
          "pointer",
          "int",
          "int",
          "int",
          "int",
          "int",
          "char"
        ]),
        directPath: bind(platformOffsets.charge.directPath, "void", [
          "pointer",
          "int",
          "int",
          "pointer"
        ]),
        pathLength: bind(platformOffsets.charge.pathLength, "int", ["pointer", "pointer"]),
        destroyEnvironment: bind(platformOffsets.charge.destroyEnvironment, "int", [
          "pointer",
          "int",
          "int",
          "int",
          "int",
          "int",
          "int",
          "int",
          "char",
          "pointer"
        ])
      },
      knockout: {
        controlStart: bind(platformOffsets.knockout.controlStart, "int", ["pointer"]),
        findObject: bind(platformOffsets.knockout.findObject, "pointer", ["pointer", "int"]),
        clearObjects: bind(platformOffsets.knockout.clearObjects, "void", ["pointer"]),
        resetMap: bind(platformOffsets.knockout.resetMap, "void", ["pointer", "int", "int"]),
        arrange: bind(platformOffsets.knockout.arrangePlayers, "void", [
          "pointer",
          "int",
          "pointer",
          "pointer",
          "pointer",
          "pointer"
        ]),
        spawn: bind(platformOffsets.knockout.spawnCharacter, "pointer", [
          "pointer",
          "pointer",
          "pointer",
          "pointer",
          "uint",
          "uint",
          "int",
          "char",
          "uint",
          "uint",
          "uint",
          "uchar",
          "uchar"
        ]),
        updatePositions: bind(platformOffsets.knockout.updatePositions, "void", ["pointer"]),
        appendPointer: bind(platformOffsets.knockout.appendPointer, "void", ["pointer", "pointer"])
      }
    };
  }

  // src/battle/BattleRoster.ts
  var battleRoster = {
    character: [16, 0],
    name: "t.me/bsvschannel"
  };

  // src/battle/hooks/LogicBattleModeServer_addPlayer.ts
  var LogicBattleModeServerAddPlayer = class {
    hook;
    constructor(base, onError, results) {
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
            if (table.isNull()) throw new Error("Character table is not loaded");
            const shelly = item(table, battleRoster.character[1]);
            if (shelly.isNull()) throw new Error("Shelly is missing from the character table");
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
            const battle = this.battle;
            results.record(
              battle.toString(),
              battle.add(220).readS32(),
              player.add(104).readS32(),
              player.add(108).readS32(),
              player.add(169).readU8() !== 0
            );
          } catch (error) {
            onError(error);
          }
        }
      });
    }
  };

  // verified-offsets-ios.json
  var verified_offsets_ios_default = {
    version: 70,
    platform: "iOS ARM64",
    imageUuid: "aa6562966bec475e83dd93f53a143049",
    imageSha256: "8537bea717182189fe8bbb29760250cd071e34ecc69c79c19b4010ac47ff9cea",
    verification: "Static IDA signatures; native iPhone Knockout rounds exercised separately (see docs/port-v70.md).",
    functions: {
      ServerConnectionUpdate: {
        rva: "0x874f58",
        bytes16: "ff0306d1e923126dfc6f13a9f85f14a9"
      },
      MessageManagerSend: {
        rva: "0x86a168",
        bytes16: "ff4301d1f65702a9f44f03a9fd7b04a9"
      },
      MessageManagerUpdate: {
        rva: "0x870c98",
        bytes16: "ff4301d1e923016df65702a9f44f03a9"
      },
      MessageManagerReceiveOwned: {
        rva: "0x871b38",
        bytes16: "f44fbea9fd7b01a9fd430091f30301aa"
      },
      CreateMessageByType: {
        rva: "0xb9f2e4",
        bytes16: "ffc300d1f44f01a9fd7b02a9fd830091"
      },
      ByteStreamSetBuffer: {
        rva: "0xd36608",
        bytes16: "f44fbea9fd7b01a9fd430091f30302aa"
      },
      OperatorNewArray: {
        rva: "0xec76b0",
        bytes16: "d00f00b010a241f900021fd6d00f00b0"
      },
      OwnHomeDataDecode: {
        rva: "0xbd1b00",
        bytes16: "f44fbea9fd7b01a9fd430091f30300aa"
      },
      StartGame: {
        rva: "0x98c2a4",
        bytes16: "ff4302d1fc6f03a9fa6704a9f85f05a9"
      },
      GetTable: {
        rva: "0xacc824",
        bytes16: "c83e00d008e10d9100d960f8c0035fd6"
      },
      TableCount: {
        rva: "0xacafa8",
        bytes16: "001440b9c0035fd6ff4301d1f65702a9"
      },
      TableItem: {
        rva: "0xacb1a8",
        bytes16: "080440f900d961f8c0035fd6081440b9"
      },
      DataName: {
        rva: "0xac75d8",
        bytes16: "000440f987b10914f44fbea9fd7b01a9"
      },
      RowString: {
        rva: "0xd33aac",
        bytes16: "f657bda9f44f01a9fd7b02a9fd830091"
      },
      KnockoutConstructor: {
        rva: "0xbefbfc",
        bytes16: "eefcff17ff4301d1f85f01a9f65702a9"
      },
      KnockoutDestructor: {
        rva: "0xbefc00",
        bytes16: "ff4301d1f85f01a9f65702a9f44f03a9"
      },
      KnockoutControlStart: {
        rva: "0xbf3be8",
        bytes16: "08a440b91f21007181000054083400d0"
      },
      KnockoutStep: {
        rva: "0xbf07e0",
        bytes16: "f44fbea9fd7b01a9fd430091f30300aa"
      },
      KnockoutIsGameOver: {
        rva: "0xbf32e4",
        bytes16: "f44fbea9fd7b01a9fd43009108844239"
      },
      KnockoutSpawnCharacter: {
        rva: "0xbf1e6c",
        bytes16: "ff4302d1fc6f03a9fa6704a9f85f05a9"
      },
      KnockoutClearObjects: {
        rva: "0xb51c94",
        bytes16: "f85fbca9f65701a9f44f02a9fd7b03a9"
      },
      KnockoutFindObject: {
        rva: "0xb53130",
        bytes16: "f44fbea9fd7b01a9fd430091f30300aa"
      },
      KnockoutResetMap: {
        rva: "0xbf6b2c",
        bytes16: "f85fbca9f65701a9f44f02a9fd7b03a9"
      },
      KnockoutArrangePlayers: {
        rva: "0xbf6bc4",
        bytes16: "ff4303d1e923066dfc6f07a9fa6708a9"
      },
      KnockoutTickObjects: {
        rva: "0xb51da4",
        bytes16: "ff0301d1f65701a9f44f02a9fd7b03a9"
      },
      KnockoutAppendPointer: {
        rva: "0x5092b8",
        bytes16: "f44fbea9fd7b01a9fd430091f30300aa"
      },
      KnockoutUpdatePositions: {
        rva: "0xbf0f1c",
        bytes16: "fc6fbaa9fa6701a9f85f02a9f65703a9"
      },
      BattleEndDecode: {
        rva: "0xbb54f4",
        bytes16: "ff0301d1f65701a9f44f02a9fd7b03a9"
      },
      BattleResultPlayerDecode: {
        rva: "0xbb8fb8",
        bytes16: "ff0301d1f65701a9f44f02a9fd7b03a9"
      },
      CharacterCalculateMovement: {
        rva: "0xb3bb54",
        bytes16: "ffc301d1fc6f01a9fa6702a9f85f03a9"
      },
      BotTick: {
        rva: "0xb8032c",
        bytes16: "fc6fbaa9fa6701a9f85f02a9f65703a9"
      },
      BattleAddPlayer: {
        rva: "0xbf11fc",
        bytes16: "ff4304d1fc6f0ba9fa670ca9f85f0da9"
      },
      BattleResetHeroStats: {
        rva: "0xbfd61c",
        bytes16: "1f0000b91f4c00b900e4004f0080803c"
      },
      StringSetUtf8: {
        rva: "0xe762bc",
        bytes16: "f657bda9f44f01a9fd7b02a9fd830091"
      },
      HotZone_createArea: {
        rva: "0xb4e0f0",
        bytes16: "f44fbea9fd7b01a9fd430091f30300aa"
      },
      HotZone_setPosition: {
        rva: "0xb598ac",
        bytes16: "01080729034000b909b040b9c900f837"
      },
      HotZone_addObject: {
        rva: "0xb52c40",
        bytes16: "ff8301d1f65703a9f44f04a9fd7b05a9"
      },
      HotZone_triggerArea: {
        rva: "0xb1cee0",
        bytes16: "ff4304d1fc6f0ba9fa670ca9f85f0da9"
      },
      HotZone_areaRadius: {
        rva: "0xb1f098",
        bytes16: "f657bda9f44f01a9fd7b02a9fd830091"
      },
      HotZone_battleTicks: {
        rva: "0xc26f00",
        bytes16: "683200f0088103910801403988000036"
      },
      HotZone_hasModifier: {
        rva: "0xbf1b7c",
        bytes16: "095c41b93f0500710b01005408b440f9"
      }
    }
  };

  // src/Definitions.ts
  function verifyImage(module) {
    if (Process.platform !== "darwin" || Process.arch !== "arm64")
      throw new Error("Target requires iOS ARM64");
    const base = module.base;
    if (base.readU32() !== 4277009103) throw new Error("Not a Mach-O 64-bit image");
    const commands = base.add(16).readU32();
    let p = base.add(32), uuid = "";
    for (let i = 0; i < commands; i++) {
      const cmd = p.readU32(), size = p.add(4).readU32();
      if (size < 8 || size > 1024 * 1024) throw new Error("Invalid Mach-O load command");
      if (cmd === 27)
        uuid = Array.from(new Uint8Array(p.add(8).readByteArray(16))).map((x) => x.toString(16).padStart(2, "0")).join("");
      p = p.add(size);
    }
    if (uuid !== imageUuid) throw new Error(`Unsupported client UUID ${uuid}; expected ${imageUuid}`);
    for (const [name, fn] of Object.entries(verified_offsets_ios_default.functions)) {
      const actual = Array.from(new Uint8Array(base.add(parseInt(fn.rva, 16)).readByteArray(16))).map((x) => x.toString(16).padStart(2, "0")).join("");
      if (actual !== fn.bytes16)
        throw new Error(`Native signature mismatch: ${name}. Use an unmodified matching v70 image.`);
    }
  }

  // src/piranhamessage.ts
  var L = layout;
  var PiranhaMessage = class {
    static type(message) {
      return new NativeFunction(message.readPointer().add(L.messageType).readPointer(), "int", [
        "pointer"
      ])(message);
    }
    static payload(message) {
      new NativeFunction(message.readPointer().add(L.encode).readPointer(), "void", ["pointer"])(
        message
      );
      const stream = message.add(L.byteStream);
      const size = Math.max(stream.add(L.streamOffset).readS32(), stream.add(L.streamSize).readS32());
      if (size < 0 || size > 1024 * 1024) throw new Error(`Invalid encoded message size ${size}`);
      return size ? Array.from(new Uint8Array(stream.add(L.streamBuffer).readPointer().readByteArray(size))) : [];
    }
    static destroy(message) {
      const vtable = message.readPointer();
      new NativeFunction(vtable.add(L.destruct).readPointer(), "void", ["pointer"])(message);
      new NativeFunction(vtable.add(L.delete).readPointer(), "void", ["pointer"])(message);
    }
  };

  // src/mainHooks.ts
  var callbacks = [];
  var bridges = [];
  function installHooks(base, messaging2, onError) {
    const O = offsets, L2 = layout;
    let initializedConnection = NULL;
    let tickFailed = false;
    function requireObject(pointer, label) {
      if (pointer.compare(NULL.add(65536)) < 0) {
        throw new Error(`Invalid ${label} pointer ${pointer}`);
      }
    }
    function readField(pointer, label, offset, read) {
      requireObject(pointer, label);
      try {
        return read(pointer.add(offset));
      } catch (error) {
        throw new Error(
          `Invalid ${label} pointer ${pointer}: cannot read field +${offset}: ${String(error)}`
        );
      }
    }
    const send = new NativeCallback(
      (manager, message) => {
        try {
          messaging2.handle(PiranhaMessage.type(message), PiranhaMessage.payload(message));
        } catch (e) {
          onError(e);
        } finally {
          if (!message.isNull()) PiranhaMessage.destroy(message);
        }
        return 1;
      },
      "int",
      ["pointer", "pointer"]
    );
    const tick = new NativeCallback(
      (connection, dt) => {
        if (tickFailed) return NULL;
        try {
          const manager = base.add(O.MessageManagerInstance).readPointer();
          if (manager.isNull()) return NULL;
          const transport = readField(
            manager,
            "MessageManager",
            L2.managerMessaging,
            (field) => field.readPointer()
          );
          if (transport.isNull()) return NULL;
          readField(transport, "Messaging", L2.messagingFailed, (field) => field.readU8());
          readField(transport, "Messaging", L2.messagingState, (field) => field.readS32());
          const connectionState = readField(
            connection,
            "ServerConnection",
            0,
            (field) => field.readS32()
          );
          readField(connection, "ServerConnection", L2.connectionValidated, (field) => field.readU8());
          transport.add(L2.messagingFailed).writeU8(0);
          transport.add(L2.messagingState).writeS32(5);
          if (!initializedConnection.equals(connection) || connectionState === 0 || messaging2.loginRequested) {
            if (!messaging2.prepare()) return NULL;
            initializedConnection = connection;
            connection.writeS32(4);
            connection.add(L2.connectionValidated).writeU8(1);
            messaging2.login();
          }
          messaging2.flush(manager);
          return manager;
        } catch (e) {
          tickFailed = true;
          onError(e);
          return NULL;
        }
      },
      "pointer",
      ["pointer", "float"]
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
      { prepare: tick, update: base.add(O.MessageManagerUpdate) }
    );
    bridges.push(bridge);
    Interceptor.replace(base.add(O.ServerConnectionUpdate), bridge.offline_tick);
    Interceptor.attach(base.add(O.BattleScreenShouldShowChatButton), {
      onLeave(retval) {
        retval.replace(ptr(1));
      }
    });
    Interceptor.attach(base.add(O.StartGame), {
      onEnter(args) {
        args[3] = ptr(3);
      }
    });
  }

  // src/Commands/LogicCommand.ts
  var LogicCommand = class {
    tickWhenGiven = 0;
    executeTick = 0;
    accountId = [0, 0];
    decode(stream) {
      this.tickWhenGiven = stream.readVInt();
      this.executeTick = stream.readVInt();
      this.accountId = stream.readVLong();
    }
    encode(stream) {
      stream.writeVInt(this.tickWhenGiven);
      stream.writeVInt(this.executeTick);
      stream.writeVLong(...this.accountId);
    }
  };

  // src/Commands/Home/LogicHeroSeenCommand.ts
  var LogicHeroSeenCommand = class extends LogicCommand {
    type = 522;
    referenceType = 16;
    characterId = 0;
    seenState = 0;
    decode(stream) {
      super.decode(stream);
      [this.referenceType, this.characterId] = stream.readDataReference();
      this.seenState = stream.readInt();
    }
    encode(stream) {
      super.encode(stream);
      stream.writeDataReference(this.referenceType, this.characterId);
      stream.writeInt(this.seenState);
    }
    execute(_profile) {
      return false;
    }
  };

  // src/Commands/Home/LogicSelectSkinCommand.ts
  var LogicSelectSkinCommand = class extends LogicCommand {
    type = 506;
    referenceType = 29;
    skinId = 0;
    selectionType = 0;
    decode(stream) {
      super.decode(stream);
      [this.referenceType, this.skinId] = stream.readDataReference();
      this.selectionType = stream.readVInt();
    }
    encode(stream) {
      super.encode(stream);
      stream.writeDataReference(this.referenceType, this.skinId);
      stream.writeVInt(this.selectionType);
    }
    execute(profile, catalog) {
      const hero = catalog?.skins.get(this.skinId);
      if (this.referenceType !== 29 || hero === void 0 || !profile.brawlers.some((b) => b.id === hero) || ![0, 1, 2].includes(this.selectionType))
        return false;
      const sameHero = (id) => catalog.skins.get(id) === hero;
      if (this.selectionType === 0) {
        profile.selectedSkins = profile.selectedSkins.filter((id) => !sameHero(id));
        profile.selectedSkins.push(this.skinId);
      } else if (this.selectionType === 1) {
        if (!profile.skinRandomizer.includes(this.skinId)) profile.skinRandomizer.push(this.skinId);
        if (!profile.currentRandomSkins.some(sameHero)) profile.currentRandomSkins.push(this.skinId);
      } else {
        profile.skinRandomizer = profile.skinRandomizer.filter((id) => id !== this.skinId);
        if (profile.currentRandomSkins.includes(this.skinId)) {
          profile.currentRandomSkins = profile.currentRandomSkins.filter((id) => id !== this.skinId);
          const replacement = profile.skinRandomizer.find(sameHero);
          if (replacement !== void 0) profile.currentRandomSkins.push(replacement);
        }
      }
      return true;
    }
  };

  // src/Commands/Home/LogicSelectCharacterCommand.ts
  var LogicSelectCharacterCommand = class extends LogicCommand {
    type = 525;
    referenceType = 16;
    characterId = 0;
    slot = 0;
    decode(stream) {
      super.decode(stream);
      [this.referenceType, this.characterId] = stream.readDataReference();
      this.slot = stream.readByte() << 24 >> 24;
    }
    encode(stream) {
      super.encode(stream);
      stream.writeDataReference(this.referenceType, this.characterId);
      stream.writeByte(this.slot);
    }
    execute(profile) {
      if (this.referenceType !== 16 || this.slot < 0 || this.slot >= 3 || !profile.brawlers.some((b) => b.id === this.characterId))
        return false;
      profile.selectedBrawlers[this.slot] = this.characterId;
      return true;
    }
  };

  // src/Commands/Home/LogicSelectFavouriteHeroCommand.ts
  var LogicSelectFavouriteHeroCommand = class extends LogicCommand {
    type = 570;
    referenceType = 16;
    value = 0;
    decode(stream) {
      super.decode(stream);
      [this.referenceType, this.value] = stream.readDataReference();
    }
    encode(stream) {
      super.encode(stream);
      stream.writeDataReference(this.referenceType, this.value);
    }
    execute(profile) {
      if (this.referenceType !== 16 || !profile.brawlers.some((b) => b.id === this.value)) return false;
      profile.favouriteBrawler = this.value;
      return true;
    }
  };

  // src/Commands/Home/LogicSetPlayerThumbnailCommand.ts
  var LogicSetPlayerThumbnailCommand = class extends LogicCommand {
    type = 505;
    referenceType = 28;
    value = 0;
    decode(stream) {
      super.decode(stream);
      [this.referenceType, this.value] = stream.readDataReference();
    }
    encode(stream) {
      super.encode(stream);
      stream.writeDataReference(this.referenceType, this.value);
    }
    execute(profile, catalog) {
      if (this.referenceType !== 28) return false;
      if (!Number.isInteger(this.value) || this.value < 0 || catalog && !catalog.thumbnails.has(this.value))
        return false;
      profile.thumbnail = this.value;
      return true;
    }
  };

  // src/Commands/Home/LogicSetPlayerNameColorCommand.ts
  var LogicSetPlayerNameColorCommand = class extends LogicCommand {
    type = 527;
    referenceType = 43;
    value = 0;
    decode(stream) {
      super.decode(stream);
      [this.referenceType, this.value] = stream.readDataReference();
    }
    encode(stream) {
      super.encode(stream);
      stream.writeDataReference(this.referenceType, this.value);
    }
    execute(profile, catalog) {
      if (this.referenceType !== 43) return false;
      if (!Number.isInteger(this.value) || this.value < 0 || catalog && !catalog.nameColors.has(this.value))
        return false;
      profile.nameColor = this.value;
      return true;
    }
  };

  // src/Commands/LogicServerCommand.ts
  var LogicServerCommand = class extends LogicCommand {
    sequence = 0;
    decode(stream) {
      this.sequence = stream.readVInt();
      super.decode(stream);
    }
    encode(stream) {
      stream.writeVInt(this.sequence);
      super.encode(stream);
    }
  };

  // src/Commands/Avatar/LogicChangeAvatarNameCommand.ts
  var LogicChangeAvatarNameCommand = class extends LogicServerCommand {
    constructor(name = "", changeNameCost = 0, metadata = null) {
      super();
      this.name = name;
      this.changeNameCost = changeNameCost;
      this.metadata = metadata;
    }
    type = 201;
    decode(stream) {
      this.name = stream.readString() ?? "";
      this.changeNameCost = stream.readVInt();
      this.metadata = stream.readString();
      super.decode(stream);
    }
    encode(stream) {
      stream.writeString(this.name);
      stream.writeVInt(this.changeNameCost);
      stream.writeString(this.metadata);
      super.encode(stream);
    }
    execute(profile) {
      if (!this.name.trim() || this.name.length > 32) return false;
      profile.name = this.name;
      profile.registered = true;
      return true;
    }
  };

  // src/Commands/Home/LogicSetSupportedCreatorCommand.ts
  var LogicSetSupportedCreatorCommand = class extends LogicServerCommand {
    constructor(code = "") {
      super();
      this.code = code;
    }
    type = 215;
    decode(stream) {
      this.code = stream.readBoolean() ? stream.readString() : null;
      super.decode(stream);
    }
    encode(stream) {
      stream.writeBoolean(this.code !== null);
      if (this.code !== null) stream.writeString(this.code);
      super.encode(stream);
    }
    execute(profile) {
      if (this.code === null || this.code.length > 64) return false;
      profile.creator = this.code;
      return true;
    }
  };

  // src/Commands/CommandManager.ts
  var clientCommands = /* @__PURE__ */ new Map([
    [522, LogicHeroSeenCommand],
    [505, LogicSetPlayerThumbnailCommand],
    [506, LogicSelectSkinCommand],
    [525, LogicSelectCharacterCommand],
    [527, LogicSetPlayerNameColorCommand],
    [570, LogicSelectFavouriteHeroCommand]
  ]);
  var serverCommands = /* @__PURE__ */ new Map([
    [201, LogicChangeAvatarNameCommand],
    [215, LogicSetSupportedCreatorCommand]
  ]);
  var CommandManager = class {
    static decode(stream, direction = "client") {
      const type = stream.readVInt();
      const Constructor = (direction === "client" ? clientCommands : serverCommands).get(type);
      if (!Constructor) return null;
      const command = new Constructor();
      command.decode(stream);
      return command;
    }
    static encode(stream, command) {
      stream.writeVInt(command.type);
      command.encode(stream);
    }
    static execute(commands, profile, catalog) {
      const next = JSON.parse(JSON.stringify(profile));
      let changed = false;
      for (const command of commands) changed = command.execute(next, catalog) || changed;
      if (changed) Object.assign(profile, next);
      return changed;
    }
  };

  // src/misc/ByteStream.ts
  var ByteStream = class {
    payload;
    offset = 0;
    bitoffset = 0;
    constructor(payload = []) {
      this.payload = payload;
    }
    require(n) {
      if (n < 0 || this.offset + n > this.payload.length)
        throw new Error(`Truncated packet at ${this.offset}, need ${n}`);
    }
    readByte() {
      this.bitoffset = 0;
      this.require(1);
      return this.payload[this.offset++];
    }
    readInt() {
      return this.readByte() << 24 | this.readByte() << 16 | this.readByte() << 8 | this.readByte();
    }
    readVInt() {
      let b = this.readByte();
      const negative = !!(b & 64);
      let value = b & 63, shift = 6;
      while (b & 128) {
        if (shift > 27) throw new Error("Invalid VInt");
        b = this.readByte();
        value |= (b & 127) << shift;
        shift += 7;
      }
      if (negative && shift < 32) value |= -1 << shift;
      return value | 0;
    }
    readVLong() {
      return [this.readVInt(), this.readVInt()];
    }
    readLong() {
      return [this.readInt(), this.readInt()];
    }
    readBytes(maxLength = 9e5) {
      const length = this.readInt();
      if (length === -1) return null;
      if (length < 0 || length > maxLength) throw new Error("Invalid byte array size");
      this.require(length);
      const bytes = this.payload.slice(this.offset, this.offset + length);
      this.offset += length;
      return bytes;
    }
    readDataReference() {
      const type = this.readVInt();
      return [type, type === 0 ? 0 : this.readVInt()];
    }
    readBoolean() {
      if (this.bitoffset === 0) {
        this.require(1);
        this.offset++;
      }
      const result = !!(this.payload[this.offset - 1] & 1 << this.bitoffset);
      this.bitoffset = this.bitoffset + 1 & 7;
      return result;
    }
    readString() {
      const size = this.readInt();
      if (size === -1) return null;
      if (size < 0 || size > 1024 * 1024) throw new Error("Invalid string size");
      this.require(size);
      const bytes = this.payload.slice(this.offset, this.offset + size);
      this.offset += size;
      return decodeURIComponent(bytes.map((x) => "%" + x.toString(16).padStart(2, "0")).join(""));
    }
    writeByte(value) {
      this.bitoffset = 0;
      this.payload.push(value & 255);
      this.offset++;
    }
    writeInt(value) {
      for (const shift of [24, 16, 8, 0]) this.writeByte(value >>> shift);
    }
    writeVInt(value) {
      value |= 0;
      let rest = value >> 6;
      let first = value & 63 | (value < 0 ? 64 : 0);
      const terminal = value < 0 ? -1 : 0;
      if (rest !== terminal) first |= 128;
      this.writeByte(first);
      while (rest !== terminal) {
        const byte = rest & 127;
        rest >>= 7;
        this.writeByte(byte | (rest !== terminal ? 128 : 0));
      }
    }
    writeBoolean(value) {
      if (this.bitoffset === 0) {
        this.payload.push(0);
        this.offset++;
      }
      if (value) this.payload[this.offset - 1] |= 1 << this.bitoffset;
      this.bitoffset = this.bitoffset + 1 & 7;
    }
    writeString(value = null) {
      if (value === null) {
        this.writeInt(-1);
        return;
      }
      const encoded = encodeURIComponent(value);
      const bytes = [];
      for (let i = 0; i < encoded.length; i++) {
        if (encoded[i] === "%") {
          bytes.push(parseInt(encoded.slice(i + 1, i + 3), 16));
          i += 2;
        } else bytes.push(encoded.charCodeAt(i));
      }
      this.writeInt(bytes.length);
      bytes.forEach((x) => this.writeByte(x));
    }
    writeStringReference(value) {
      this.writeString(value);
    }
    writeLong(high, low) {
      this.writeInt(high);
      this.writeInt(low);
    }
    writeBytes(bytes) {
      this.writeInt(bytes === null ? -1 : bytes.length);
      if (bytes !== null) for (const byte of bytes) this.writeByte(byte);
    }
    writeVLong(high, low) {
      this.writeVInt(high);
      this.writeVInt(low);
    }
    writeDataReference(type, id = 0) {
      this.writeVInt(type);
      if (type !== 0) this.writeVInt(id);
    }
  };

  // src/packets/server/AvailableServerCommandMessage.ts
  var AvailableServerCommandMessage = class {
    constructor(command = null) {
      this.command = command;
    }
    type = 24111;
    decode(stream) {
      this.command = CommandManager.decode(stream, "server");
    }
    encode() {
      if (!this.command) throw new Error("No server command");
      const stream = new ByteStream();
      CommandManager.encode(stream, this.command);
      return stream.payload;
    }
  };

  // src/packets/server/AvatarNameCheckResponseMessage.ts
  var AvatarNameCheckResponseMessage = class {
    constructor(name = null) {
      this.name = name;
    }
    type = 20300;
    encode() {
      const stream = new ByteStream();
      const invalid = !this.name || !this.name.trim() || this.name.length > 32;
      stream.writeBoolean(invalid);
      stream.writeInt(invalid ? 1 : 0);
      stream.writeString(this.name);
      return stream.payload;
    }
  };

  // src/packets/client/ClientMessage.ts
  var ClientMessage = class {
    trailingPayload = [];
    decodeTail(stream) {
      this.trailingPayload = stream.payload.slice(stream.offset);
      stream.offset = stream.payload.length;
      stream.bitoffset = 0;
    }
    encodeTail(stream) {
      for (const byte of this.trailingPayload) stream.writeByte(byte);
    }
    toPayload() {
      const stream = new ByteStream();
      this.encode(stream);
      return stream.payload;
    }
  };

  // src/packets/client/ClientHelloMessage.ts
  var ClientHelloMessage = class extends ClientMessage {
    type = 10100;
    protocolVersion = 2;
    keyVersion = 0;
    major = 70;
    minor = 0;
    build = 0;
    resourceSha = null;
    deviceType = 0;
    appStore = 0;
    authenticationData = null;
    hasAuthenticationData = true;
    decode(stream) {
      this.protocolVersion = stream.readInt();
      this.keyVersion = stream.readInt();
      this.major = stream.readInt();
      this.minor = stream.readInt();
      this.build = stream.readInt();
      this.resourceSha = stream.readString();
      this.deviceType = stream.readInt();
      this.appStore = stream.readInt();
      this.hasAuthenticationData = stream.offset < stream.payload.length;
      this.authenticationData = this.hasAuthenticationData ? stream.readBytes() : null;
      this.decodeTail(stream);
    }
    encode(stream) {
      stream.writeInt(this.protocolVersion);
      stream.writeInt(this.keyVersion);
      stream.writeInt(this.major);
      stream.writeInt(this.minor);
      stream.writeInt(this.build);
      stream.writeString(this.resourceSha);
      stream.writeInt(this.deviceType);
      stream.writeInt(this.appStore);
      if (this.hasAuthenticationData) stream.writeBytes(this.authenticationData);
      this.encodeTail(stream);
    }
  };

  // src/packets/client/AuthenticationMessage.ts
  var AuthenticationMessage = class _AuthenticationMessage extends ClientMessage {
    type = 10101;
    accountId = [0, 0];
    passToken = null;
    major = 70;
    minor = 1;
    build = 0;
    resourceSha = null;
    deviceId = null;
    field256 = [0, 0];
    device = null;
    deviceOSVersion = null;
    isAndroid = false;
    language = null;
    preferredLanguage = null;
    isDevelopmentBuild = false;
    advertisingId = null;
    randomKey = 0;
    field312 = 0;
    clientVersion = null;
    field328 = null;
    field344 = null;
    field360 = 0;
    field376 = null;
    field392 = null;
    field408 = null;
    compressedSupercellIdToken = null;
    field424 = false;
    field432 = null;
    field448 = null;
    field464 = null;
    field480 = null;
    field496 = null;
    field512 = null;
    field144 = null;
    field160 = null;
    extensionGroups = 2;
    legacyGroups = 14;
    legacyStrings = [null, null, null, null, null, null, null];
    decode(stream) {
      Object.assign(this, new _AuthenticationMessage());
      this.accountId = stream.readLong();
      this.passToken = stream.readString();
      this.major = stream.readInt();
      this.minor = stream.readInt();
      this.build = stream.readInt();
      this.resourceSha = stream.readString();
      if (this.minor === 0) this.decodeLegacy(stream);
      else {
        this.deviceId = stream.readString();
        this.field256 = stream.readDataReference();
        this.device = stream.readString();
        this.deviceOSVersion = stream.readString();
        this.isAndroid = stream.readBoolean();
        this.language = stream.readString();
        this.preferredLanguage = stream.readString();
        this.isDevelopmentBuild = stream.readBoolean();
        this.advertisingId = stream.readString();
        this.randomKey = stream.readInt();
        this.field312 = stream.readVInt();
        this.clientVersion = stream.readString();
        this.field328 = stream.readString();
        this.field344 = stream.readString();
        this.field360 = stream.readVInt();
        this.field376 = stream.readString();
        this.field392 = stream.readString();
        this.field408 = stream.readString();
        this.compressedSupercellIdToken = stream.readBytes();
        this.field424 = stream.readBoolean();
        this.field432 = stream.readString();
        this.field448 = stream.readString();
        this.extensionGroups = 0;
        if (stream.offset < stream.payload.length) {
          this.extensionGroups = 1;
          this.field464 = stream.readString();
          this.field480 = stream.readString();
          this.field496 = stream.readString();
          this.field512 = stream.readString();
          if (stream.offset < stream.payload.length) {
            this.extensionGroups = 2;
            this.field144 = stream.readString();
            this.field160 = stream.readString();
          }
        }
      }
      this.decodeTail(stream);
    }
    encode(stream) {
      stream.writeLong(...this.accountId);
      stream.writeString(this.passToken);
      stream.writeInt(this.major);
      stream.writeInt(this.minor);
      stream.writeInt(this.build);
      stream.writeString(this.resourceSha);
      if (this.minor === 0) this.encodeLegacy(stream);
      else {
        stream.writeString(this.deviceId);
        stream.writeDataReference(...this.field256);
        stream.writeString(this.device);
        stream.writeString(this.deviceOSVersion);
        stream.writeBoolean(this.isAndroid);
        stream.writeString(this.language);
        stream.writeString(this.preferredLanguage);
        stream.writeBoolean(this.isDevelopmentBuild);
        stream.writeString(this.advertisingId);
        stream.writeInt(this.randomKey);
        stream.writeVInt(this.field312);
        stream.writeString(this.clientVersion);
        stream.writeString(this.field328);
        stream.writeString(this.field344);
        stream.writeVInt(this.field360);
        stream.writeString(this.field376);
        stream.writeString(this.field392);
        stream.writeString(this.field408);
        stream.writeBytes(this.compressedSupercellIdToken);
        stream.writeBoolean(this.field424);
        stream.writeString(this.field432);
        stream.writeString(this.field448);
        if (this.extensionGroups >= 1) {
          stream.writeString(this.field464);
          stream.writeString(this.field480);
          stream.writeString(this.field496);
          stream.writeString(this.field512);
        }
        if (this.extensionGroups >= 2) {
          stream.writeString(this.field144);
          stream.writeString(this.field160);
        }
      }
      this.encodeTail(stream);
    }
    decodeLegacy(stream) {
      this.legacyGroups = 0;
      this.legacyStrings[0] = stream.readString();
      this.legacyStrings[1] = stream.readString();
      this.legacyStrings[2] = stream.readString();
      this.deviceId = stream.readString();
      if (stream.offset === stream.payload.length) return;
      this.field256 = stream.readDataReference();
      this.device = stream.readString();
      this.legacyGroups = 1;
      if (stream.offset === stream.payload.length) return;
      this.legacyStrings[3] = stream.readString();
      this.legacyGroups = 2;
      if (stream.offset === stream.payload.length) return;
      this.deviceOSVersion = stream.readString();
      this.legacyGroups = 3;
      if (stream.offset === stream.payload.length) return;
      this.isAndroid = stream.readBoolean();
      this.legacyGroups = 4;
      if (stream.offset === stream.payload.length) return;
      this.language = stream.readString();
      this.preferredLanguage = stream.readString();
      this.legacyGroups = 5;
      if (stream.offset === stream.payload.length) return;
      this.legacyStrings[4] = stream.readString();
      this.legacyGroups = 6;
      if (stream.offset === stream.payload.length) return;
      this.isDevelopmentBuild = stream.readBoolean();
      this.advertisingId = stream.readString();
      this.legacyGroups = 7;
      if (stream.offset === stream.payload.length) return;
      this.randomKey = stream.readInt();
      this.legacyGroups = 8;
      if (stream.offset === stream.payload.length) return;
      this.field312 = stream.readVInt();
      this.legacyStrings[5] = stream.readString();
      this.legacyStrings[6] = stream.readString();
      this.legacyGroups = 9;
      if (stream.offset === stream.payload.length) return;
      this.clientVersion = stream.readString();
      this.legacyGroups = 10;
      if (stream.offset === stream.payload.length) return;
      this.field328 = stream.readString();
      this.field344 = stream.readString();
      this.field360 = stream.readVInt();
      this.legacyGroups = 11;
      if (stream.offset === stream.payload.length) return;
      this.field376 = stream.readString();
      this.field392 = stream.readString();
      this.field408 = stream.readString();
      this.legacyGroups = 12;
      if (stream.offset === stream.payload.length) return;
      this.compressedSupercellIdToken = stream.readBytes();
      this.legacyGroups = 13;
      if (stream.offset === stream.payload.length) return;
      this.field424 = stream.readBoolean();
      this.legacyGroups = 14;
    }
    encodeLegacy(stream) {
      stream.writeString(this.legacyStrings[0]);
      stream.writeString(this.legacyStrings[1]);
      stream.writeString(this.legacyStrings[2]);
      stream.writeString(this.deviceId);
      if (this.legacyGroups < 1) return;
      stream.writeDataReference(...this.field256);
      stream.writeString(this.device);
      if (this.legacyGroups < 2) return;
      stream.writeString(this.legacyStrings[3]);
      if (this.legacyGroups < 3) return;
      stream.writeString(this.deviceOSVersion);
      if (this.legacyGroups < 4) return;
      stream.writeBoolean(this.isAndroid);
      if (this.legacyGroups < 5) return;
      stream.writeString(this.language);
      stream.writeString(this.preferredLanguage);
      if (this.legacyGroups < 6) return;
      stream.writeString(this.legacyStrings[4]);
      if (this.legacyGroups < 7) return;
      stream.writeBoolean(this.isDevelopmentBuild);
      stream.writeString(this.advertisingId);
      if (this.legacyGroups < 8) return;
      stream.writeInt(this.randomKey);
      if (this.legacyGroups < 9) return;
      stream.writeVInt(this.field312);
      stream.writeString(this.legacyStrings[5]);
      stream.writeString(this.legacyStrings[6]);
      if (this.legacyGroups < 10) return;
      stream.writeString(this.clientVersion);
      if (this.legacyGroups < 11) return;
      stream.writeString(this.field328);
      stream.writeString(this.field344);
      stream.writeVInt(this.field360);
      if (this.legacyGroups < 12) return;
      stream.writeString(this.field376);
      stream.writeString(this.field392);
      stream.writeString(this.field408);
      if (this.legacyGroups < 13) return;
      stream.writeBytes(this.compressedSupercellIdToken);
      if (this.legacyGroups < 14) return;
      stream.writeBoolean(this.field424);
    }
  };

  // src/packets/client/KeepAliveMessage.ts
  var KeepAliveMessage = class extends ClientMessage {
    type = 10108;
    decode(stream) {
      this.decodeTail(stream);
    }
    encode(stream) {
      this.encodeTail(stream);
    }
  };

  // src/packets/client/GoHomeMessage.ts
  var GoHomeMessage = class extends ClientMessage {
    type = 14101;
    decode(stream) {
      this.decodeTail(stream);
    }
    encode(stream) {
      this.encodeTail(stream);
    }
  };

  // src/packets/client/GoHomeFromOfflinePractiseMessage.ts
  var GoHomeFromOfflinePractiseMessage = class extends ClientMessage {
    type = 17750;
    flag144 = false;
    decode(stream) {
      this.flag144 = stream.readBoolean();
      this.decodeTail(stream);
    }
    encode(stream) {
      stream.writeBoolean(this.flag144);
      this.encodeTail(stream);
    }
  };

  // src/packets/client/GoHomeFromMapEditorMessage.ts
  var GoHomeFromMapEditorMessage = class extends ClientMessage {
    type = 12108;
    decode(stream) {
      this.decodeTail(stream);
    }
    encode(stream) {
      this.encodeTail(stream);
    }
  };

  // src/battle/ClientBattlePlayer.ts
  var ClientBattlePlayer = class {
    character = [0, 0];
    skin = [0, 0];
    teamIndex = 0;
    isPlayer = false;
    name = null;
    decode(stream) {
      this.character = stream.readDataReference();
      this.skin = stream.readDataReference();
      this.teamIndex = stream.readVInt();
      this.isPlayer = stream.readBoolean();
      this.name = stream.readString();
    }
    encode(stream) {
      stream.writeDataReference(...this.character);
      stream.writeDataReference(...this.skin);
      stream.writeVInt(this.teamIndex);
      stream.writeBoolean(this.isPlayer);
      stream.writeString(this.name);
    }
  };

  // src/packets/client/AskForBattleEndMessage.ts
  var AskForBattleEndMessage = class extends ClientMessage {
    type = 14110;
    battleResult = 0;
    rank = 0;
    field152 = 0;
    location = [0, 0];
    players = [];
    decode(stream) {
      this.battleResult = stream.readVInt();
      this.rank = stream.readVInt();
      this.field152 = stream.readVInt();
      this.location = stream.readDataReference();
      const count = stream.readVInt();
      if (count < 0 || count > 100) throw new Error("Invalid battle player count");
      this.players = [];
      for (let i = 0; i < count; i++) {
        const player = new ClientBattlePlayer();
        player.decode(stream);
        this.players.push(player);
      }
      this.decodeTail(stream);
    }
    encode(stream) {
      if (this.players.length > 100) throw new Error("Invalid battle player count");
      stream.writeVInt(this.battleResult);
      stream.writeVInt(this.rank);
      stream.writeVInt(this.field152);
      stream.writeDataReference(...this.location);
      stream.writeVInt(this.players.length);
      for (const player of this.players) player.encode(stream);
      this.encodeTail(stream);
    }
  };

  // src/packets/client/EndClientTurnMessage.ts
  var EndClientTurnMessage = class extends ClientMessage {
    type = 14102;
    isCompressed = false;
    tick = 0;
    additionalData = null;
    commands = [];
    unknownCommandType = null;
    unknownCommandCount = 0;
    decode(stream) {
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
            `[offline-v70] Unhandled command ${this.unknownCommandType}; remaining commands skipped`
          );
          break;
        }
        this.commands.push(command);
      }
      if (this.unknownCommandCount === 0) this.additionalData = stream.readBytes();
      this.decodeTail(stream);
    }
    encode(stream) {
      stream.writeBoolean(this.isCompressed);
      stream.writeVInt(this.tick);
      stream.writeVInt(this.commands.length + this.unknownCommandCount);
      for (const command of this.commands) CommandManager.encode(stream, command);
      if (this.unknownCommandCount === 0) stream.writeBytes(this.additionalData);
      this.encodeTail(stream);
    }
  };

  // src/packets/client/AvatarNameCheckMessage.ts
  var AvatarNameCheckMessage = class extends ClientMessage {
    type = 14600;
    name = null;
    decode(stream) {
      this.name = stream.readString();
      this.decodeTail(stream);
    }
    encode(stream) {
      stream.writeString(this.name);
      this.encodeTail(stream);
    }
  };

  // src/packets/client/ChangeAvatarNameMessage.ts
  var ChangeAvatarNameMessage = class extends ClientMessage {
    type = 10212;
    name = null;
    decode(stream) {
      this.name = stream.readString();
      this.decodeTail(stream);
    }
    encode(stream) {
      stream.writeString(this.name);
      this.encodeTail(stream);
    }
  };

  // src/packets/client/SetSupportedCreatorMessage.ts
  var SetSupportedCreatorMessage = class extends ClientMessage {
    type = 18686;
    code = null;
    decode(stream) {
      this.code = stream.readString();
      this.decodeTail(stream);
    }
    encode(stream) {
      stream.writeString(this.code);
      this.encodeTail(stream);
    }
  };

  // src/profiles/PlayerDisplayData.ts
  var PlayerDisplayData = class {
    name = null;
    experience = 100;
    thumbnail = 28e6;
    nameColor = 43e6;
    premiumNameColor = 43e6;
    flag32 = false;
    field36 = 0;
    field40 = 0;
    decode(stream) {
      this.name = stream.readString();
      this.experience = stream.readVInt();
      this.thumbnail = stream.readVInt();
      this.nameColor = stream.readVInt();
      this.premiumNameColor = stream.readVInt();
      this.flag32 = stream.readBoolean();
      this.field36 = stream.readVInt();
      this.field40 = stream.readVInt();
    }
    encode(stream) {
      stream.writeString(this.name);
      stream.writeVInt(this.experience);
      stream.writeVInt(this.thumbnail);
      stream.writeVInt(this.nameColor);
      stream.writeVInt(this.premiumNameColor);
      stream.writeBoolean(this.flag32);
      stream.writeVInt(this.field36);
      stream.writeVInt(this.field40);
    }
  };

  // src/profiles/ProfileQueryContext.ts
  var ProfileQueryContext = class {
    field0 = 0;
    accountId = [0, 0];
    field16 = 0;
    flag20 = false;
    heroes = [];
    references = [];
    field104 = 0;
    display = new PlayerDisplayData();
    optionalId = null;
    cardReferences = [
      [0, 0],
      [0, 0],
      [0, 0]
    ];
    values = [];
    statistics = [0, 0, 0, 0, 0, 0, 0];
    trailingReferences = Array.from({ length: 9 }, () => [0, 0]);
    count(stream) {
      const count = stream.readVInt();
      if (count < 0 || count > 1e3) throw new Error("Invalid profile query count");
      return count;
    }
    decode(stream) {
      this.field0 = stream.readVInt();
      this.accountId = stream.readLong();
      this.field16 = stream.readVInt();
      this.flag20 = stream.readBoolean();
      this.heroes = Array.from({ length: this.count(stream) }, () => ({
        reference: stream.readDataReference(),
        values: [stream.readVInt(), stream.readVInt(), stream.readVInt()]
      }));
      this.references = Array.from({ length: this.count(stream) }, () => stream.readDataReference());
      this.field104 = stream.readVInt();
      this.display.decode(stream);
      this.optionalId = stream.readBoolean() ? stream.readLong() : null;
      this.cardReferences = Array.from({ length: 3 }, () => stream.readDataReference());
      this.values = Array.from({ length: this.count(stream) }, () => stream.readVInt());
      this.statistics = Array.from({ length: 7 }, () => stream.readVInt());
      this.trailingReferences = Array.from({ length: 9 }, () => stream.readDataReference());
    }
    encode(stream) {
      stream.writeVInt(this.field0);
      stream.writeLong(...this.accountId);
      stream.writeVInt(this.field16);
      stream.writeBoolean(this.flag20);
      stream.writeVInt(this.heroes.length);
      for (const hero of this.heroes) {
        stream.writeDataReference(...hero.reference);
        hero.values.forEach((v) => stream.writeVInt(v));
      }
      stream.writeVInt(this.references.length);
      this.references.forEach((ref) => stream.writeDataReference(...ref));
      stream.writeVInt(this.field104);
      this.display.encode(stream);
      stream.writeBoolean(this.optionalId !== null);
      if (this.optionalId) stream.writeLong(...this.optionalId);
      this.cardReferences.forEach((ref) => stream.writeDataReference(...ref));
      stream.writeVInt(this.values.length);
      this.values.forEach((value) => stream.writeVInt(value));
      this.statistics.forEach((value) => stream.writeVInt(value));
      this.trailingReferences.forEach((ref) => stream.writeDataReference(...ref));
    }
  };

  // src/packets/client/GetPlayerProfileMessage.ts
  var GetPlayerProfileMessage = class extends ClientMessage {
    type = 15081;
    context = null;
    requestType = 0;
    accountId = [0, 0];
    profileContext = null;
    decode(stream) {
      this.context = stream.readBoolean() ? Array.from({ length: 12 }, () => stream.readVInt()) : null;
      this.requestType = stream.readVInt();
      this.accountId = stream.readLong();
      this.profileContext = null;
      if (stream.readBoolean()) {
        this.profileContext = new ProfileQueryContext();
        this.profileContext.decode(stream);
      }
      this.decodeTail(stream);
    }
    encode(stream) {
      if (this.context && this.context.length !== 12)
        throw new Error("Profile request context must contain 12 VInts");
      stream.writeBoolean(this.context !== null);
      if (this.context) this.context.forEach((value) => stream.writeVInt(value));
      stream.writeVInt(this.requestType);
      stream.writeLong(...this.accountId);
      stream.writeBoolean(this.profileContext !== null);
      if (this.profileContext) this.profileContext.encode(stream);
      this.encodeTail(stream);
    }
  };

  // src/message/MessageFactory.ts
  var messages = /* @__PURE__ */ new Map([
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
    [15081, GetPlayerProfileMessage]
  ]);
  var MessageFactory = class {
    static decode(type, payload) {
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
  };

  // src/battle/BattleResultPlayer.ts
  var BattleResultPlayer = class {
    constructor(player, ownTeam, profile) {
      this.player = player;
      this.ownTeam = ownTeam;
      this.profile = profile;
    }
    encode(s) {
      const p = this.player, own = p.isPlayer;
      const hero = own ? this.profile.brawlers.find((h) => h.id === p.character[1]) : void 0;
      s.writeBoolean(own);
      s.writeBoolean(p.teamIndex !== this.ownTeam);
      s.writeBoolean(false);
      s.writeVInt(1);
      s.writeDataReference(...p.character);
      s.writeVInt(1);
      s.writeDataReference(...p.skin);
      s.writeVInt(1);
      s.writeVInt(hero?.trophies ?? 0);
      s.writeVInt(1);
      s.writeVInt(0);
      s.writeVInt(1);
      s.writeVInt(hero?.power ?? 1);
      s.writeVInt(0);
      s.writeBoolean(own);
      if (own) s.writeLong(this.profile.id[0], this.profile.id[1]);
      const display = new PlayerDisplayData();
      display.name = p.name ?? (own ? this.profile.name : null);
      if (own) {
        display.thumbnail += this.profile.thumbnail;
        display.nameColor += this.profile.nameColor;
        display.premiumNameColor = display.nameColor;
      }
      display.encode(s);
      s.writeBoolean(false);
      for (let i = 0; i < 4; i++) s.writeByte(0);
      for (let i = 0; i < 4; i++) s.writeInt(0);
      s.writeDataReference(0);
      s.writeDataReference(0);
      s.writeVInt(0);
      s.writeVInt(0);
      s.writeVInt(0);
      s.writeVInt(0);
      for (let i = 0; i < 9; i++) s.writeDataReference(0);
    }
  };

  // src/packets/server/BattleEndMessage.ts
  var BattleEndMessage = class {
    constructor(battle, profile, gameMode = 1, variation = 0) {
      this.battle = battle;
      this.profile = profile;
      this.gameMode = gameMode;
      this.variation = variation;
      if (!Number.isInteger(gameMode) || ![0, 1, 2, 5, 7].includes(gameMode))
        throw new Error("Invalid battle result mode");
      if (!Number.isInteger(variation) || variation < 0 || variation > 90)
        throw new Error("Invalid battle mode variation");
      if (battle.players.length < 1 || battle.players.length > 100 || battle.players.filter((p) => p.isPlayer).length !== 1)
        throw new Error("Battle result requires one local player");
      if (![0, 1, 2].includes(battle.battleResult)) throw new Error("Invalid battle result");
      if ((gameMode === 2 || gameMode === 5) && (!Number.isInteger(battle.rank) || battle.rank < 1 || battle.rank > 100))
        throw new Error("Invalid battle placement");
    }
    type = 23456;
    encode() {
      const s = new ByteStream(), own = this.battle.players.find((p) => p.isPlayer);
      s.writeLong(0, 0);
      s.writeLong(0, 0);
      s.writeVInt(this.gameMode);
      s.writeVInt(
        this.gameMode === 2 || this.gameMode === 5 ? this.battle.rank : this.battle.battleResult
      );
      for (let i = 0; i < 9; i++) s.writeVInt(0);
      s.writeBoolean(false);
      s.writeVInt(0);
      s.writeVInt(0);
      s.writeBoolean(false);
      s.writeBoolean(false);
      for (let i = 0; i < 8; i++) s.writeVInt(0);
      for (let i = 0; i < 6; i++) s.writeBoolean(false);
      s.writeVInt(-1);
      s.writeBoolean(false);
      const players = this.gameMode === 0 || this.gameMode === 2 ? [own] : this.gameMode === 5 ? this.battle.players.filter((p) => p.teamIndex === own.teamIndex) : this.battle.players;
      s.writeVInt(players.length);
      for (const player of players)
        new BattleResultPlayer(player, own.teamIndex, this.profile).encode(s);
      s.writeVInt(0);
      s.writeVInt(0);
      s.writeVInt(0);
      s.writeDataReference(0);
      s.writeBoolean(false);
      s.writeBoolean(false);
      s.writeBoolean(false);
      s.writeBoolean(false);
      s.writeVInt(this.variation);
      s.writeVInt(0);
      s.writeVInt(0);
      s.writeBoolean(false);
      s.writeVInt(0);
      s.writeBoolean(false);
      s.writeVInt(0);
      for (let i = 0; i < 5; i++) s.writeBoolean(false);
      s.writeVInt(0);
      s.writeVInt(0);
      s.writeBoolean(false);
      s.writeBoolean(false);
      for (let i = 0; i < 5; i++) s.writeVInt(0);
      s.writeBoolean(false);
      s.writeBoolean(false);
      s.writeBoolean(false);
      s.writeVInt(0);
      s.writeBoolean(false);
      s.writeVInt(0);
      s.writeDataReference(0);
      s.writeBoolean(false);
      s.writeVInt(0);
      s.writeVInt(1);
      s.writeVInt(-1);
      s.writeBoolean(false);
      s.writeVInt(0);
      s.writeBoolean(false);
      s.writeVInt(-1);
      s.writeVInt(-1);
      s.writeBoolean(false);
      s.writeVInt(0);
      s.writeVInt(0);
      s.writeDataReference(0);
      s.writeVInt(0);
      return s.payload;
    }
  };

  // src/packets/server/PlayerProfileMessage.ts
  var PlayerProfileMessage = class {
    constructor(profile, skinOwners) {
      this.profile = profile;
      this.skinOwners = skinOwners;
    }
    type = 24113;
    encode() {
      const s = new ByteStream(), p = this.profile;
      s.writeVLong(p.id[0], p.id[1]);
      s.writeDataReference(16, p.favouriteBrawler);
      s.writeDataReference(0);
      s.writeVInt(p.brawlers.length);
      for (const hero of p.brawlers) {
        s.writeDataReference(16, hero.id);
        const skin = p.selectedSkins.find((id) => this.skinOwners?.get(id) === hero.id);
        if (skin === void 0) s.writeDataReference(0);
        else s.writeDataReference(29, skin);
        s.writeVInt(hero.trophies);
        s.writeVInt(hero.trophies);
        s.writeVInt(0);
        s.writeVInt(hero.power - 1);
        s.writeVInt(0);
      }
      const trophies = Math.min(
        2147483647,
        p.brawlers.reduce((total, hero) => total + hero.trophies, 0)
      );
      const stats = [
        [1, 0],
        [8, 0],
        [11, 0],
        [29, trophies],
        [4, trophies]
      ];
      s.writeVInt(stats.length);
      for (const [key, value] of stats) {
        s.writeVInt(key);
        s.writeVInt(value);
      }
      const display = new PlayerDisplayData();
      display.name = p.name;
      display.thumbnail = 28e6 + p.thumbnail;
      display.nameColor = display.premiumNameColor = 43e6 + p.nameColor;
      display.encode(s);
      s.writeBoolean(false);
      s.writeString(null);
      s.writeVInt(0);
      s.writeVInt(0);
      s.writeVInt(0);
      for (let i = 0; i < 7; i++) s.writeDataReference(0);
      s.writeVInt(0);
      s.writeString(null);
      s.writeString(null);
      s.writeBoolean(false);
      s.writeDataReference(0);
      s.writeVInt(0);
      return s.payload;
    }
  };

  // src/message/MessageManager.ts
  var MessageManager = class {
    constructor(connection) {
      this.connection = connection;
    }
    lastActivity = Date.now();
    lastUnhandled = null;
    handle(type, payload) {
      this.lastActivity = Date.now();
      const message = MessageFactory.decode(type, payload);
      if (!message) {
        this.lastUnhandled = type;
        console.log(`[offline-v70] Unsupported message ${type}`);
        return;
      }
      this.receiveMessage(message);
    }
    receiveMessage(message) {
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
          const unhandled = message;
          throw new Error(`Missing message handler: ${String(unhandled)}`);
        }
      }
    }
    clientHelloReceived(_message) {
    }
    loginReceived(message) {
      this.connection.authenticate(message.accountId, message.passToken);
    }
    keepAliveReceived(_message) {
    }
    goHomeReceived(_message) {
      this.connection.sendHome();
    }
    goHomeFromOfflinePractiseReceived(_message) {
      this.connection.sendHome();
    }
    goHomeFromMapEditorReceived(_message) {
      this.connection.sendHome();
    }
    askForBattleEndReceived(message) {
      const variation = this.connection.getBattleVariation?.(message.location) ?? 0;
      const result = this.connection.prepareBattleResult?.(message, variation) ?? message;
      const response = new BattleEndMessage(
        result,
        this.connection.config,
        this.connection.getBattleMode?.(message.location) ?? 1,
        variation
      );
      this.connection.send(response.type, response.encode());
    }
    endClientTurnReceived(message) {
      if (CommandManager.execute(
        message.commands,
        this.connection.config,
        this.connection.selectionCatalog
      ))
        this.connection.save();
    }
    avatarNameCheckReceived(message) {
      const response = new AvatarNameCheckResponseMessage(message.name);
      this.connection.send(response.type, response.encode());
    }
    changeNameReceived(message) {
      const { name } = message;
      if (!name || !name.trim() || name.length > 32) return;
      const command = new LogicChangeAvatarNameCommand(name);
      command.execute(this.connection.config);
      this.connection.save();
      const response = new AvailableServerCommandMessage(command);
      this.connection.send(response.type, response.encode());
    }
    setSupportedCreatorReceived(message) {
      const command = new LogicSetSupportedCreatorCommand(message.code);
      if (command.execute(this.connection.config)) this.connection.save();
      const response = new AvailableServerCommandMessage(
        new LogicSetSupportedCreatorCommand(this.connection.config.creator)
      );
      this.connection.send(response.type, response.encode());
    }
    getPlayerProfileReceived(message) {
      const id = message.accountId.every((n) => n === 0) ? this.connection.config.id : message.accountId;
      const profile = this.connection.getProfile(id);
      if (!profile) {
        console.log(`[offline-v70] Local profile ${id.join(":")} not found`);
        return;
      }
      const response = new PlayerProfileMessage(profile, this.connection.selectionCatalog?.skins);
      this.connection.send(response.type, response.encode());
    }
  };

  // src/home/BrawlPassSeasonData.ts
  var BrawlPassSeasonData = class {
    season = 55;
    points = 0;
    premium = true;
    progress = 0;
    flag41 = false;
    flag40 = false;
    rewardBits8 = [0, 0, 0, 0];
    rewardBits16 = [0, 0, 0, 0];
    flag42 = false;
    rewardBits24 = [0, 0, 0, 0];
    tailReference = [0, 0];
    tailEntries = [];
    value72 = 0;
    readBits(s) {
      return s.readBoolean() ? Array.from({ length: 4 }, () => s.readInt()) : null;
    }
    writeBits(s, bits) {
      s.writeBoolean(bits !== null);
      if (bits) {
        if (bits.length !== 4) throw new Error("Brawl Pass reward bitset must have 128 bits");
        bits.forEach((value) => s.writeInt(value));
      }
    }
    decode(s) {
      this.season = s.readVInt();
      this.points = s.readVInt();
      this.premium = s.readBoolean();
      this.progress = s.readVInt();
      this.flag41 = s.readBoolean();
      this.flag40 = s.readBoolean();
      this.rewardBits8 = this.readBits(s);
      this.rewardBits16 = this.readBits(s);
      this.flag42 = s.readBoolean();
      this.rewardBits24 = this.readBits(s);
      this.tailReference = s.readDataReference();
      const count = s.readVInt();
      if (count < 0 || count > 1e3) throw new Error("Invalid Brawl Pass tail count");
      this.tailEntries = Array.from({ length: count }, () => ({
        value8: s.readVInt(),
        value12: s.readVInt(),
        reference: s.readDataReference()
      }));
      this.value72 = s.readInt();
    }
    encode(s) {
      s.writeVInt(this.season);
      s.writeVInt(this.points);
      s.writeBoolean(this.premium);
      s.writeVInt(this.progress);
      s.writeBoolean(this.flag41);
      s.writeBoolean(this.flag40);
      this.writeBits(s, this.rewardBits8);
      this.writeBits(s, this.rewardBits16);
      s.writeBoolean(this.flag42);
      this.writeBits(s, this.rewardBits24);
      s.writeDataReference(...this.tailReference);
      s.writeVInt(this.tailEntries.length);
      for (const entry of this.tailEntries) {
        s.writeVInt(entry.value8);
        s.writeVInt(entry.value12);
        s.writeDataReference(...entry.reference);
      }
      s.writeInt(this.value72);
    }
  };
  function penultimatePassSeason(rows) {
    const seasons = [
      ...new Set(
        rows.map((row) => Number(row.values.Season)).filter((value) => Number.isInteger(value) && value >= 0)
      )
    ].sort((a, b) => a - b);
    if (seasons.length < 2) throw new Error("Cannot find the penultimate Brawl Pass season");
    return seasons[seasons.length - 2];
  }

  // src/packets/server/OwnHomeDataMessage.ts
  function writeVIntList(stream, values) {
    stream.writeVInt(values.length);
    for (const value of values) stream.writeVInt(value);
  }
  function writeSettings(stream, values) {
    stream.writeVInt(values.length);
    for (const [value, settingId] of values) stream.writeVLong(value, settingId);
  }
  function writeDailyData(stream, config, skinIds) {
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(1e5);
    stream.writeVInt(1e5);
    stream.writeVInt(1e5);
    stream.writeVInt(454);
    stream.writeVInt(1488);
    stream.writeDataReference(28, config.thumbnail);
    stream.writeDataReference(43, config.nameColor);
    stream.writeVInt(94);
    for (let gameModeId = 0; gameModeId < 94; gameModeId++) {
      stream.writeVInt(gameModeId);
    }
    for (let i = 0; i < 6; i++) {
      const ids = [
        config.selectedSkins,
        config.skinRandomizer,
        config.currentRandomSkins,
        skinIds,
        [],
        []
      ][i];
      stream.writeVInt(ids.length);
      for (const id of ids) stream.writeDataReference(29, id);
    }
    stream.writeVInt(0);
    stream.writeVInt(1e5);
    stream.writeVInt(0);
    stream.writeVInt(1);
    stream.writeBoolean(true);
    stream.writeVInt(19500);
    stream.writeVInt(111111);
    stream.writeVInt(1375134);
    stream.writeVInt(0);
    stream.writeVInt(1375134);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeBoolean(true);
    stream.writeVInt(2);
    stream.writeVInt(2);
    stream.writeVInt(2);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(200);
    stream.writeVInt(-1);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(-1);
    stream.writeByte(1);
    stream.writeDataReference(16, config.selectedBrawlers[0]);
    stream.writeString(config.country);
    stream.writeString(config.creator);
    writeSettings(stream, [
      [1, 9],
      [1, 22],
      [3, 25],
      [1, 24],
      [2, 15],
      [32447, 28],
      [100, 46],
      [1, 52]
    ]);
    stream.writeVInt(0);
    stream.writeVInt(config.brawlPass.enabled ? 1 : 0);
    if (config.brawlPass.enabled) {
      const pass = new BrawlPassSeasonData();
      pass.season = config.brawlPass.season;
      pass.points = config.brawlPass.points;
      pass.premium = config.brawlPass.premium;
      pass.encode(stream);
    }
    stream.writeBoolean(false);
    stream.writeBoolean(true);
    stream.writeVInt(0);
    stream.writeBoolean(false);
    stream.writeInt(0);
    stream.writeVInt(0);
    stream.writeDataReference(16, config.favouriteBrawler);
    stream.writeBoolean(false);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeDataReference(2, 0);
    stream.writeDataReference(2, 0);
    stream.writeDataReference(2, 0);
    stream.writeDataReference(2, 0);
    stream.writeBoolean(false);
    stream.writeDataReference(2, 0);
    stream.writeVInt(770);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
  }
  function writeConfData(stream, events, now) {
    stream.writeVInt(events.length);
    for (const event of events) stream.writeVInt(event.slot);
    stream.writeVInt(events.length);
    for (const event of events) event.encode(stream, now);
    stream.writeVInt(0);
    stream.writeVInt(0);
    writeVIntList(stream, [20, 35, 75, 140, 290, 480, 800, 1250, 1875, 2800]);
    writeVIntList(stream, [30, 80, 170, 360]);
    writeVIntList(stream, [300, 880, 2040, 4680]);
    stream.writeVInt(0);
    writeSettings(stream, [
      [501, 10008],
      [0, 10046],
      [30, 10050],
      [0, 10051],
      [5600, 10060],
      [200, 117],
      [1, 128],
      [0, 65],
      [41000187, 1],
      [99999999, 131],
      [1e5, 138],
      [1, 95],
      [55598, 47],
      [1, 123],
      [200, 124],
      [55598, 48],
      [3, 50],
      [500, 1100],
      [500, 1101],
      [1, 1002],
      [500, 1102]
    ]);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    writeVIntList(stream, [0, 29, 79, 169, 349, 699]);
    writeVIntList(stream, [0, 160, 450, 500, 1250, 2500]);
    writeVIntList(stream, [0, 100, 400, 1e3, 3e3]);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
  }
  function writeClientHome(stream, config) {
    stream.writeLong(config.id[0], config.id[1]);
    stream.writeVInt(0);
    stream.writeVInt(-1);
    stream.writeBoolean(false);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeVInt(0);
    stream.writeBoolean(false);
    stream.writeVInt(0);
    stream.writeDataReference(0);
    stream.writeDataReference(0);
    stream.writeDataReference(0);
    stream.writeDataReference(0);
    stream.writeDataReference(0);
    stream.writeDataReference(0);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeInt(0);
    stream.writeBoolean(false);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeBoolean(false);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeVInt(0);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
  }
  function writeClientAvatar(stream, config) {
    stream.writeVLong(config.id[0], config.id[1]);
    stream.writeVLong(config.id[0], config.id[1]);
    stream.writeVLong(0, 0);
    stream.writeStringReference(config.name);
    stream.writeBoolean(config.registered);
    stream.writeInt(-1);
    stream.writeVInt(35);
    for (let category = 0; category < 35; category++) {
      stream.writeVInt(0);
      const entries = [];
      if (category === 0) {
        for (const b of config.brawlers) entries.push([23, b.card, 1]);
        if (config.coins) entries.push([5, 8, config.coins]);
        if (config.bling) entries.push([5, 23, config.bling]);
      }
      if (category === 1 || category === 3) {
        for (const b of config.brawlers) if (b.trophies) entries.push([16, b.id, b.trophies]);
      }
      if (category === 5) {
        for (const b of config.brawlers) if (b.power > 1) entries.push([16, b.id, b.power - 1]);
      }
      stream.writeVInt(entries.length);
      for (const [type, id, value] of entries) {
        stream.writeDataReference(type, id);
        stream.writeVInt(-1);
        stream.writeVInt(value);
      }
    }
    stream.writeVInt(config.gems);
    stream.writeVInt(config.gems);
    stream.writeVInt(0);
    stream.writeVInt(100);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(2);
    stream.writeVInt(1);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeString(null);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(2);
    stream.writeVInt(0);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
  }
  var OwnHomeDataMessage = class {
    static encode(config, events = [], now = Date.now(), skinIds = []) {
      const stream = new ByteStream();
      stream.writeVInt(0);
      stream.writeVInt(-1);
      writeDailyData(stream, config, skinIds);
      writeConfData(stream, events, now);
      writeClientHome(stream, config);
      writeClientAvatar(stream, config);
      return stream.payload;
    }
  };

  // src/packets/server/LoginOkMessage.ts
  var LoginOkMessage = class {
    static encode(id = [0, 1], passToken = "") {
      let stream = new ByteStream([]);
      stream.writeLong(id[0], id[1]);
      stream.writeLong(id[0], id[1]);
      stream.writeString(passToken);
      stream.writeString("");
      stream.writeString("");
      stream.writeInt(70);
      stream.writeInt(2);
      stream.writeInt(3);
      stream.writeString("dev");
      stream.writeInt(0);
      stream.writeInt(0);
      stream.writeInt(0);
      stream.writeString("");
      stream.writeString("");
      stream.writeString("");
      stream.writeInt(0);
      stream.writeString("");
      stream.writeString("EN");
      stream.writeString("");
      stream.writeInt(0);
      stream.writeString("");
      stream.writeInt(2);
      stream.writeString("https://game-assets.brawlstarsgame.com");
      stream.writeString(
        "http://a678dbc1c015a893c9fd-4e8cc3b1ad3a3c940c504815caefa967.r87.cf2.rackcdn.com"
      );
      stream.writeInt(3);
      stream.writeString("https://event-assets.brawlstars.com");
      stream.writeString("https://event-assets-2.brawlstars.com");
      stream.writeString(
        "https://24b999e6da07674e22b0-8209975788a0f2469e68e84405ae4fcf.ssl.cf2.rackcdn.com/event-assets"
      );
      stream.writeVInt(0);
      stream.writeInt(0);
      stream.writeBoolean(true);
      stream.writeBoolean(false);
      stream.writeString("");
      stream.writeString("");
      stream.writeString("");
      stream.writeString("https://play.google.com/store/apps/details?id=com.supercell.brawlstars");
      stream.writeString("");
      stream.writeBoolean(false);
      for (let i = 0; i < 4; i++) stream.writeBoolean(false);
      return stream.payload;
    }
  };

  // src/battle/ClientData.ts
  var ClientData = class {
    getTable;
    constructor(base) {
      this.getTable = nativeFunctions(base).table.get;
    }
    string(value) {
      const length = value.add(4).readS32();
      if (length < 0 || length > 4096) throw new Error("Invalid CSV String length");
      return (length >= 8 ? value.add(8).readPointer() : value.add(8)).readUtf8String(length) ?? "";
    }
    rows(type, fields) {
      const table = this.getTable(type);
      if (table.isNull()) return null;
      const count = table.add(20).readS32();
      if (!count) return null;
      if (count < 0 || count > 2e4) throw new Error(`Invalid CSV table ${type} size`);
      const items = table.add(8).readPointer();
      const csv = items.readPointer().add(8).readPointer().readPointer();
      const columns = /* @__PURE__ */ new Map();
      let node = csv.add(16).readPointer();
      for (let i = 0; !node.isNull(); i++, node = node.readPointer()) {
        if (i >= 1024) throw new Error("Invalid CSV column chain");
        columns.set(this.string(node.add(16)), node.add(32).readS32());
      }
      return Array.from({ length: count }, (_, i) => {
        const data = items.add(i * 8).readPointer();
        const row = data.add(8).readPointer().add(8).readS32();
        const values = {};
        for (const field of fields) {
          const column = columns.get(field);
          if (column === void 0) {
            values[field] = "";
            continue;
          }
          const cell = csv.add(56).readPointer().add(column * 8).readPointer();
          switch (cell.readS32()) {
            case 0:
              values[field] = this.string(
                cell.add(8).readPointer().add(row * 16)
              );
              break;
            case 1:
              values[field] = String(
                cell.add(24).readPointer().add(row * 4).readS32()
              );
              break;
            case 2:
              values[field] = String(cell.add(40).readPointer().add(row).readU8());
              break;
            case 3:
              values[field] = String(
                cell.add(56).readPointer().add(row * 4).readFloat()
              );
              break;
            default:
              throw new Error("Invalid CSV column type");
          }
        }
        return { id: data.add(32).readS32() - type * 1e6, values };
      });
    }
  };

  // src/battle/Inventory.ts
  function applyInventory(config, characters, cards) {
    const heroes = new Map(
      characters.filter((row) => row.values.Type === "Hero" && row.values.Disabled !== "1").map((row) => [row.values.Name, row.id])
    );
    const unlocks = /* @__PURE__ */ new Map();
    for (const row of cards) {
      if (row.values.Type.toLowerCase() !== "unlock" || row.values.Disabled === "1") continue;
      const hero = heroes.get(row.values.Target);
      if (hero !== void 0) unlocks.set(hero, row.id);
    }
    if (config.autoUnlockBrawlers && !unlocks.size)
      throw new Error("No hero unlock cards found in loaded CSV tables");
    const characterIds = new Set(characters.map((row) => row.id)), cardIds = new Set(cards.map((row) => row.id));
    config.brawlers = config.brawlers.filter(
      (b) => config.autoUnlockBrawlers ? unlocks.has(b.id) : characterIds.has(b.id) && cardIds.has(b.card)
    );
    for (const [id, card] of unlocks) {
      const existing = config.brawlers.find((b) => b.id === id);
      if (existing) existing.card = card;
      else if (config.autoUnlockBrawlers) config.brawlers.push({ id, card, power: 11, trophies: 0 });
    }
    config.brawlers.sort((a, b) => a.id - b.id);
    if (!config.brawlers.length) throw new Error("No valid unlocked brawlers in profile");
    const fallback = config.brawlers[0].id;
    config.selectedBrawlers = config.selectedBrawlers.map(
      (id) => config.brawlers.some((b) => b.id === id) ? id : fallback
    );
    if (!config.brawlers.some((b) => b.id === config.favouriteBrawler))
      config.favouriteBrawler = fallback;
    return unlocks.size;
  }
  function prepareInventory(base, config) {
    const data = new ClientData(base);
    const characters = data.rows(16, ["Name", "Type", "Disabled"]);
    const cards = data.rows(23, ["Name", "Type", "Target", "Disabled"]);
    const seasons = config.brawlPass.enabled ? data.rows(65, ["Season"]) : [];
    if (!characters || !cards || !seasons) return false;
    if (config.brawlPass.enabled) {
      config.brawlPass.season = penultimatePassSeason(seasons);
      console.log(
        `[offline-v70] Brawl Pass season ${config.brawlPass.season + 1} (wire ID ${config.brawlPass.season})`
      );
    }
    const discovered = applyInventory(config, characters, cards);
    console.log(
      `[offline-v70] ${config.brawlers.length} brawlers; discovered ${discovered} unlock cards`
    );
    return true;
  }

  // src/message/ResponseQueue.ts
  var ResponseQueue = class {
    constructor(now = Date.now) {
      this.now = now;
    }
    queue = [];
    get length() {
      return this.queue.length;
    }
    enqueue(type, payload, delayMs) {
      if (!Number.isInteger(delayMs) || delayMs < 0 || delayMs > 6e4)
        throw new Error("Invalid response delay");
      if (this.queue.length >= 256) throw new Error("Offline response queue overflow");
      const previous = this.queue[this.queue.length - 1]?.readyAt ?? 0;
      this.queue.push({
        type,
        payload: [...payload],
        readyAt: Math.max(this.now() + delayMs, previous)
      });
    }
    drain() {
      const now = this.now();
      let count = 0;
      while (count < this.queue.length && this.queue[count].readyAt <= now) count++;
      return this.queue.splice(0, count);
    }
    clear() {
      this.queue = [];
    }
  };

  // src/packets/server/AuthenticationFailedMessage.ts
  var AuthenticationFailedMessage = class {
    constructor(reason = "Invalid local account ID or token", errorCode = 1) {
      this.reason = reason;
      this.errorCode = errorCode;
    }
    type = 20103;
    encode() {
      const stream = new ByteStream();
      stream.writeInt(this.errorCode);
      for (let i = 0; i < 4; i++) stream.writeString(null);
      stream.writeString(this.reason);
      stream.writeInt(0);
      stream.writeBoolean(false);
      stream.writeBytes(null);
      stream.writeInt(-1);
      stream.writeInt(0);
      stream.writeInt(0);
      stream.writeString(null);
      stream.writeInt(0);
      stream.writeBoolean(false);
      stream.writeBoolean(false);
      stream.writeString(null);
      stream.writeVInt(0);
      stream.writeString(null);
      for (let i = 0; i < 8; i++) stream.writeBoolean(false);
      return stream.payload;
    }
  };

  // src/battle/OfflineBattleResults.ts
  var OfflineBattleResults = class {
    current = null;
    begin(key) {
      this.current = { key, variation: null, players: /* @__PURE__ */ new Map(), winner: null };
    }
    reset() {
      this.current = null;
    }
    record(key, variation, index, team, isBot) {
      if (!this.current || this.current.key !== key) this.begin(key);
      this.current.variation = variation;
      this.current.players.set(index, { team, isBot });
    }
    finishTeamMatch(key, variation, winner) {
      if (this.current?.key === key && this.current.variation === variation)
        this.current.winner = winner;
    }
    finishKnockout(key, winner) {
      this.finishTeamMatch(key, 20, winner);
    }
    prepare(message, variation) {
      const context = this.current;
      if (!context) return message;
      if (context.variation !== variation || context.players.size !== message.players.length || !message.players.every((p, i) => context.players.get(i)?.team === p.teamIndex))
        throw new Error("Battle result does not match the active native roster");
      const local = [...context.players].filter(([, p]) => !p.isBot);
      if (local.length !== 1) throw new Error("Native offline roster requires one human player");
      const [index, player] = local[0];
      const result = Object.assign(new AskForBattleEndMessage(), message);
      result.players = message.players.map(
        (p, i) => Object.assign(new ClientBattlePlayer(), p, { isPlayer: i === index })
      );
      if ((variation === 20 || variation === 17) && context.winner !== null) {
        result.battleResult = context.winner === 100 ? 2 : context.winner === player.team ? 0 : 1;
      }
      return result;
    }
  };

  // src/battle/SkinInventory.ts
  var enabled = (row) => !["1", "true"].includes(row.values.Disabled?.toLowerCase());
  function unlockedSkins(skins, confs, characters) {
    const heroes = new Set(
      characters.filter((row) => enabled(row) && row.values.Type === "Hero").map((row) => row.values.Name)
    );
    const playable = new Set(
      confs.filter((row) => heroes.has(row.values.Character)).map((row) => row.values.Name)
    );
    const ordinary = [];
    const progression = /* @__PURE__ */ new Map();
    for (const skin of skins) {
      if (!enabled(skin) || !playable.has(skin.values.Conf)) continue;
      const base = skin.values.ProgressionSkinBase;
      if (!base) {
        ordinary.push(skin.id);
        continue;
      }
      const level = Number(skin.values.ProgressionSkinLevel);
      if (!Number.isInteger(level) || level < 0) continue;
      const previous = progression.get(base);
      if (!previous || level > Number(previous.values.ProgressionSkinLevel) || level === Number(previous.values.ProgressionSkinLevel) && skin.id < previous.id)
        progression.set(base, skin);
    }
    return [.../* @__PURE__ */ new Set([...ordinary, ...Array.from(progression.values(), (row) => row.id)])].sort(
      (a, b) => a - b
    );
  }

  // config/events.json
  var events_default = {
    rotationHours: 24,
    refreshHourUtc: 9,
    slots: [
      { slot: 1, modes: ["GemGrab"] },
      { slot: 2, modes: ["Showdown"] },
      { slot: 3, modes: ["DuoShowdown"] },
      { slot: 4, modes: ["BrawlBall"] },
      { slot: 5, modes: ["Heist", "Bounty"] },
      { slot: 6, modes: ["KingOfHill"] },
      { slot: 7, modes: ["Knockout"] }
    ]
  };

  // src/events/EventData.ts
  var EventData = class {
    constructor(slot, location, startsAt, endsAt, mode) {
      this.slot = slot;
      this.location = location;
      this.startsAt = startsAt;
      this.endsAt = endsAt;
      this.mode = mode;
    }
    encode(stream, now = Date.now()) {
      stream.writeVInt(-1);
      stream.writeVInt(this.slot);
      stream.writeVInt(0);
      stream.writeVInt(Math.max(0, Math.ceil((this.startsAt - now) / 1e3)));
      stream.writeVInt(Math.max(0, Math.ceil((this.endsAt - now) / 1e3)));
      stream.writeVInt(0);
      stream.writeDataReference(15, this.location);
      stream.writeDataReference(0);
      stream.writeVInt(2);
      stream.writeString(null);
      for (let i = 0; i < 6; i++) stream.writeVInt(0);
      stream.writeBoolean(false);
      stream.writeBoolean(false);
      stream.writeVInt(0);
      stream.writeBoolean(false);
      stream.writeVInt(0);
      stream.writeVInt(0);
      for (let i = 0; i < 4; i++) stream.writeBoolean(false);
      stream.writeVInt(-1);
      stream.writeBoolean(false);
      stream.writeDataReference(0);
      stream.writeBoolean(false);
      for (let i = 0; i < 4; i++) stream.writeVInt(-1);
      for (let i = 0; i < 8; i++) stream.writeBoolean(false);
    }
  };

  // src/events/EventRotation.ts
  var EventRotation = class {
    constructor(locations, modes, config = events_default) {
      this.locations = locations;
      this.modes = modes;
      this.config = config;
      if (!Number.isInteger(config.rotationHours) || config.rotationHours < 1 || config.rotationHours > 168 || !Number.isInteger(config.refreshHourUtc) || config.refreshHourUtc < 0 || config.refreshHourUtc > 23)
        throw new Error("Invalid event rotation period");
      const ids = /* @__PURE__ */ new Set();
      for (const { slot, modes: allowed } of config.slots) {
        if (!Number.isInteger(slot) || slot < 1 || slot > 38 || ids.has(slot) || !allowed.length)
          throw new Error("Invalid event slot");
        ids.add(slot);
        for (const mode of allowed)
          if (!this.pool(mode).length) throw new Error(`No enabled maps for ${mode} in slot ${slot}`);
      }
    }
    pool(mode) {
      if (!this.modes.some((row) => row.values.Name === mode && row.values.Disabled !== "1")) return [];
      let rows = this.locations.filter(
        (row) => row.values.Disabled !== "1" && row.values.GameModeVariation === mode && !!row.values.Map
      );
      if (mode === "Showdown" || mode === "DuoShowdown") {
        const counterpart = mode === "Showdown" ? "DuoShowdown" : "Showdown";
        const maps = new Set(
          this.locations.filter(
            (row) => row.values.Disabled !== "1" && row.values.GameModeVariation === counterpart
          ).map((row) => row.values.Map)
        );
        rows = rows.filter((row) => maps.has(row.values.Map));
      }
      rows.sort(
        (a, b) => a.values.Map < b.values.Map ? -1 : a.values.Map > b.values.Map ? 1 : a.id - b.id
      );
      return rows.filter((row, i) => i === 0 || row.values.Map !== rows[i - 1].values.Map);
    }
    generate(now = Date.now()) {
      const duration2 = this.config.rotationHours * 36e5;
      const origin = this.config.refreshHourUtc * 36e5;
      const period = Math.floor((now - origin) / duration2);
      const start = origin + period * duration2;
      const mod = (value, size) => (value % size + size) % size;
      return this.config.slots.map(({ slot, modes }) => {
        const mode = modes[mod(period, modes.length)];
        const pool = this.pool(mode);
        const turn = Math.floor(period / modes.length);
        const row = pool[mod(turn, pool.length)];
        return new EventData(slot, row.id, start, start + duration2, mode);
      });
    }
  };

  // src/battle/BattleCatalog.ts
  var duoModes = /* @__PURE__ */ new Set([
    "DuoShowdown",
    "TrioShowdown",
    "TrioShowdownLimbo",
    "DuoShowdownPlus",
    "LoadedDuoShowdown"
  ]);
  function resultMode(name) {
    if (name === "Tutorial") return 0;
    if (name === "Showdown") return 2;
    if (duoModes.has(name)) return 5;
    if (name === "Duels") return 7;
    return 1;
  }
  function battleLocationMaps(locations, modes) {
    const byName = new Map(modes.map((row) => [row.values.Name, Number(row.values.Variation)]));
    const variations = /* @__PURE__ */ new Map();
    const resultModes = /* @__PURE__ */ new Map();
    for (const location of locations) {
      const name = location.values.GameModeVariation;
      const variation = byName.get(name);
      if (variation !== void 0 && Number.isInteger(variation) && variation >= 0 && variation <= 90) {
        variations.set(location.id, variation);
      }
      resultModes.set(location.id, resultMode(name));
    }
    return { variations, resultModes };
  }
  function selectionCatalog(skins, skinConfs, characters, thumbnails, nameColors, ownedSkinIds) {
    const heroesByName = new Map(characters.map((row) => [row.values.Name, row.id]));
    const heroesByConf = new Map(
      skinConfs.map((row) => [row.values.Name, heroesByName.get(row.values.Character)])
    );
    const owned = new Set(ownedSkinIds);
    const eligible = (rows) => new Set(rows.filter((row) => row.values.Disabled !== "1").map((row) => row.id));
    const skinHeroes = /* @__PURE__ */ new Map();
    for (const skin of skins) {
      const hero = heroesByConf.get(skin.values.Conf);
      if (owned.has(skin.id) && hero !== void 0) skinHeroes.set(skin.id, hero);
    }
    return {
      skins: skinHeroes,
      thumbnails: eligible(thumbnails),
      nameColors: eligible(nameColors)
    };
  }

  // src/Messaging.ts
  var Messaging = class {
    constructor(base, store, now = Date.now) {
      this.base = base;
      this.store = store;
      this.queue = new ResponseQueue(now);
      const self = this;
      this.messageManager = new MessageManager({
        get config() {
          return self.store.config;
        },
        get selectionCatalog() {
          return self.selectionCatalog;
        },
        save: () => this.store.save(),
        send: (type, payload) => this.enqueue(type, payload),
        sendHome: () => this.home(),
        authenticate: (id, token) => this.authenticate(id, token),
        getProfile: (id) => this.store.getProfile(id),
        prepareBattleResult: (message, variation) => this.battleResults.prepare(message, variation),
        getBattleMode: (location) => location[0] === 15 ? this.resultModes.get(location[1]) ?? 1 : 1,
        getBattleVariation: (location) => {
          const variation = location[0] === 15 ? this.resultVariations.get(location[1]) : void 0;
          if (variation === void 0)
            throw new Error(`Unknown battle location ${location.join(":")}`);
          return variation;
        }
      });
      const native = nativeFunctions(base).messaging;
      this.create = native.create;
      this.allocate = native.allocate;
      this.setBuffer = native.setBuffer;
      this.receive = native.receive;
    }
    queue;
    battleResults = new OfflineBattleResults();
    loginRequested = false;
    create;
    allocate;
    setBuffer;
    receive;
    sent = 0;
    received = 0;
    messageManager;
    get lastUnhandled() {
      return this.messageManager.lastUnhandled;
    }
    inventoryReady = false;
    skinIds = [];
    selectionCatalog;
    eventRotation = null;
    resultModes = /* @__PURE__ */ new Map();
    resultVariations = /* @__PURE__ */ new Map();
    enqueue(type, payload) {
      this.queue.enqueue(type, payload, this.store.config.sendDelayMs ?? 100);
    }
    home() {
      if (!this.eventRotation) throw new Error("Event tables are not ready");
      const now = Date.now();
      this.enqueue(
        24101,
        OwnHomeDataMessage.encode(
          this.store.config,
          this.eventRotation.generate(now),
          now,
          this.skinIds
        )
      );
    }
    prepare() {
      if (this.inventoryReady) return true;
      const data = new ClientData(this.base);
      const locations = data.rows(15, ["Name", "Map", "GameModeVariation", "Disabled"]);
      const modes = data.rows(48, ["Name", "Disabled", "Variation"]);
      const skins = data.rows(29, [
        "Name",
        "Conf",
        "Disabled",
        "ProgressionSkinBase",
        "ProgressionSkinLevel"
      ]);
      const confs = data.rows(44, ["Name", "Character"]);
      const characters = data.rows(16, ["Name", "Type", "Disabled"]);
      const thumbnails = data.rows(28, ["Disabled"]);
      const nameColors = data.rows(43, ["Disabled"]);
      if (!locations || !modes || !skins || !confs || !characters || !thumbnails || !nameColors)
        return false;
      this.skinIds = unlockedSkins(skins, confs, characters);
      const owned = new Set(this.skinIds);
      this.selectionCatalog = selectionCatalog(
        skins,
        confs,
        characters,
        thumbnails,
        nameColors,
        this.skinIds
      );
      for (const key of ["selectedSkins", "skinRandomizer", "currentRandomSkins"])
        this.store.config[key] = this.store.config[key].filter((id) => owned.has(id));
      console.log(
        `[offline-v70] ${this.skinIds.length} skins; progression groups use the highest level`
      );
      this.eventRotation = new EventRotation(locations, modes);
      const battleLocations = battleLocationMaps(locations, modes);
      this.resultVariations = battleLocations.variations;
      this.resultModes = battleLocations.resultModes;
      if (!prepareInventory(this.base, this.store.config)) return false;
      this.store.save();
      this.inventoryReady = true;
      return true;
    }
    get pendingResponses() {
      return this.queue.length;
    }
    login() {
      this.enqueue(20104, LoginOkMessage.encode(this.store.config.id, this.store.token));
      this.home();
      this.loginRequested = false;
    }
    accountChanged() {
      this.battleResults.reset();
      this.queue.clear();
      this.inventoryReady = false;
      this.loginRequested = true;
    }
    createAccount(name) {
      const id = this.store.create(name);
      this.accountChanged();
      return { id, name: this.store.config.name };
    }
    selectAccount(id) {
      if (!this.store.select(id)) return false;
      this.accountChanged();
      return true;
    }
    authenticate(id, token) {
      if (this.store.authenticate(id, token)) this.accountChanged();
      else {
        const response = new AuthenticationFailedMessage();
        this.enqueue(response.type, response.encode());
      }
    }
    flush(manager) {
      const batch = this.queue.drain();
      for (const { type, payload } of batch) this.sendOfflineMessage(manager, type, payload);
    }
    sendOfflineMessage(manager, type, payload) {
      const transport = manager.add(layout.managerMessaging).readPointer();
      if (transport.isNull()) throw new Error(`Messaging is unavailable for response ${type}`);
      const factory = transport.add(layout.messagingFactory).readPointer();
      if (factory.isNull()) throw new Error(`Message factory is unavailable for response ${type}`);
      const message = this.create(factory, type);
      if (message.isNull()) throw new Error(`No native message factory for ${type}`);
      let handedOff = false;
      try {
        message.add(layout.messageVersion).writeS32(type === 20104 ? 1 : 0);
        const buffer = this.allocate(payload.length || 1);
        if (buffer.isNull()) throw new Error("Native allocation failed");
        if (payload.length) buffer.writeByteArray(payload);
        this.setBuffer(message.add(layout.byteStream), buffer, payload.length);
        new NativeFunction(message.readPointer().add(layout.decode).readPointer(), "void", [
          "pointer"
        ])(message);
        handedOff = true;
        this.receive(manager, message);
        this.sent++;
        if (this.store.config.verbose)
          console.log(`[offline-v70] S ${type} (${payload.length} bytes)`);
      } finally {
        if (!handedOff) PiranhaMessage.destroy(message);
      }
    }
    handle(type, payload) {
      this.received++;
      const c = this.store.config;
      if (c.verbose && type !== 14102)
        console.log(`[offline-v70] C ${type} (${payload.length} bytes)`);
      this.messageManager.handle(type, payload);
    }
  };

  // config/config.json
  var config_default = {
    id: [
      0,
      1
    ],
    name: "Offline-v70",
    registered: false,
    brawlPass: {
      enabled: true,
      season: 55,
      premium: true,
      points: 0
    },
    country: "RU",
    creator: "Offline-v70",
    thumbnail: 0,
    nameColor: 0,
    favouriteBrawler: 0,
    selectedSkins: [],
    skinRandomizer: [],
    currentRandomSkins: [],
    selectedBrawlers: [
      0,
      1,
      2
    ],
    gems: 99999,
    coins: 999999,
    bling: 99999,
    brawlers: [
      {
        id: 0,
        card: 0,
        power: 11,
        trophies: 0
      },
      {
        id: 1,
        card: 4,
        power: 11,
        trophies: 0
      },
      {
        id: 2,
        card: 8,
        power: 11,
        trophies: 0
      },
      {
        id: 3,
        card: 12,
        power: 11,
        trophies: 0
      },
      {
        id: 4,
        card: 16,
        power: 11,
        trophies: 0
      },
      {
        id: 5,
        card: 20,
        power: 11,
        trophies: 0
      },
      {
        id: 6,
        card: 24,
        power: 11,
        trophies: 0
      },
      {
        id: 7,
        card: 28,
        power: 11,
        trophies: 0
      },
      {
        id: 8,
        card: 32,
        power: 11,
        trophies: 0
      },
      {
        id: 9,
        card: 36,
        power: 11,
        trophies: 0
      },
      {
        id: 10,
        card: 40,
        power: 11,
        trophies: 0
      },
      {
        id: 11,
        card: 44,
        power: 11,
        trophies: 0
      },
      {
        id: 12,
        card: 48,
        power: 11,
        trophies: 0
      },
      {
        id: 13,
        card: 52,
        power: 11,
        trophies: 0
      },
      {
        id: 14,
        card: 56,
        power: 11,
        trophies: 0
      },
      {
        id: 15,
        card: 60,
        power: 11,
        trophies: 0
      },
      {
        id: 16,
        card: 64,
        power: 11,
        trophies: 0
      },
      {
        id: 17,
        card: 68,
        power: 11,
        trophies: 0
      },
      {
        id: 18,
        card: 72,
        power: 11,
        trophies: 0
      },
      {
        id: 19,
        card: 95,
        power: 11,
        trophies: 0
      },
      {
        id: 20,
        card: 100,
        power: 11,
        trophies: 0
      },
      {
        id: 21,
        card: 105,
        power: 11,
        trophies: 0
      },
      {
        id: 22,
        card: 110,
        power: 11,
        trophies: 0
      },
      {
        id: 23,
        card: 115,
        power: 11,
        trophies: 0
      },
      {
        id: 24,
        card: 120,
        power: 11,
        trophies: 0
      },
      {
        id: 25,
        card: 125,
        power: 11,
        trophies: 0
      },
      {
        id: 26,
        card: 130,
        power: 11,
        trophies: 0
      },
      {
        id: 27,
        card: 177,
        power: 11,
        trophies: 0
      },
      {
        id: 28,
        card: 182,
        power: 11,
        trophies: 0
      },
      {
        id: 29,
        card: 188,
        power: 11,
        trophies: 0
      },
      {
        id: 30,
        card: 194,
        power: 11,
        trophies: 0
      },
      {
        id: 31,
        card: 200,
        power: 11,
        trophies: 0
      },
      {
        id: 32,
        card: 206,
        power: 11,
        trophies: 0
      },
      {
        id: 34,
        card: 218,
        power: 11,
        trophies: 0
      },
      {
        id: 35,
        card: 224,
        power: 11,
        trophies: 0
      },
      {
        id: 36,
        card: 230,
        power: 11,
        trophies: 0
      },
      {
        id: 37,
        card: 236,
        power: 11,
        trophies: 0
      },
      {
        id: 38,
        card: 279,
        power: 11,
        trophies: 0
      },
      {
        id: 39,
        card: 296,
        power: 11,
        trophies: 0
      },
      {
        id: 40,
        card: 303,
        power: 11,
        trophies: 0
      },
      {
        id: 41,
        card: 320,
        power: 11,
        trophies: 0
      },
      {
        id: 42,
        card: 327,
        power: 11,
        trophies: 0
      },
      {
        id: 43,
        card: 334,
        power: 11,
        trophies: 0
      },
      {
        id: 44,
        card: 341,
        power: 11,
        trophies: 0
      },
      {
        id: 45,
        card: 358,
        power: 11,
        trophies: 0
      },
      {
        id: 46,
        card: 365,
        power: 11,
        trophies: 0
      },
      {
        id: 47,
        card: 372,
        power: 11,
        trophies: 0
      },
      {
        id: 48,
        card: 379,
        power: 11,
        trophies: 0
      },
      {
        id: 49,
        card: 386,
        power: 11,
        trophies: 0
      },
      {
        id: 50,
        card: 393,
        power: 11,
        trophies: 0
      },
      {
        id: 51,
        card: 410,
        power: 11,
        trophies: 0
      },
      {
        id: 52,
        card: 417,
        power: 11,
        trophies: 0
      },
      {
        id: 53,
        card: 427,
        power: 11,
        trophies: 0
      },
      {
        id: 54,
        card: 434,
        power: 11,
        trophies: 0
      },
      {
        id: 56,
        card: 448,
        power: 11,
        trophies: 0
      },
      {
        id: 57,
        card: 466,
        power: 11,
        trophies: 0
      },
      {
        id: 58,
        card: 474,
        power: 11,
        trophies: 0
      },
      {
        id: 59,
        card: 491,
        power: 11,
        trophies: 0
      },
      {
        id: 60,
        card: 499,
        power: 11,
        trophies: 0
      },
      {
        id: 61,
        card: 507,
        power: 11,
        trophies: 0
      },
      {
        id: 62,
        card: 515,
        power: 11,
        trophies: 0
      },
      {
        id: 63,
        card: 523,
        power: 11,
        trophies: 0
      },
      {
        id: 64,
        card: 531,
        power: 11,
        trophies: 0
      },
      {
        id: 65,
        card: 539,
        power: 11,
        trophies: 0
      },
      {
        id: 66,
        card: 547,
        power: 11,
        trophies: 0
      },
      {
        id: 67,
        card: 557,
        power: 11,
        trophies: 0
      },
      {
        id: 68,
        card: 565,
        power: 11,
        trophies: 0
      },
      {
        id: 69,
        card: 573,
        power: 11,
        trophies: 0
      },
      {
        id: 70,
        card: 581,
        power: 11,
        trophies: 0
      },
      {
        id: 71,
        card: 589,
        power: 11,
        trophies: 0
      },
      {
        id: 72,
        card: 597,
        power: 11,
        trophies: 0
      },
      {
        id: 73,
        card: 605,
        power: 11,
        trophies: 0
      },
      {
        id: 74,
        card: 619,
        power: 11,
        trophies: 0
      },
      {
        id: 75,
        card: 633,
        power: 11,
        trophies: 0
      },
      {
        id: 76,
        card: 642,
        power: 11,
        trophies: 0
      },
      {
        id: 77,
        card: 655,
        power: 11,
        trophies: 0
      },
      {
        id: 78,
        card: 663,
        power: 11,
        trophies: 0
      },
      {
        id: 79,
        card: 671,
        power: 11,
        trophies: 0
      },
      {
        id: 80,
        card: 730,
        power: 11,
        trophies: 0
      },
      {
        id: 81,
        card: 748,
        power: 11,
        trophies: 0
      },
      {
        id: 82,
        card: 760,
        power: 11,
        trophies: 0
      },
      {
        id: 83,
        card: 768,
        power: 11,
        trophies: 0
      },
      {
        id: 84,
        card: 800,
        power: 11,
        trophies: 0
      },
      {
        id: 85,
        card: 811,
        power: 11,
        trophies: 0
      },
      {
        id: 86,
        card: 828,
        power: 11,
        trophies: 0
      },
      {
        id: 87,
        card: 844,
        power: 11,
        trophies: 0
      },
      {
        id: 89,
        card: 871,
        power: 11,
        trophies: 0
      },
      {
        id: 90,
        card: 879,
        power: 11,
        trophies: 0
      },
      {
        id: 91,
        card: 901,
        power: 11,
        trophies: 0
      },
      {
        id: 92,
        card: 911,
        power: 11,
        trophies: 0
      },
      {
        id: 93,
        card: 925,
        power: 11,
        trophies: 0
      },
      {
        id: 94,
        card: 934,
        power: 11,
        trophies: 0
      },
      {
        id: 95,
        card: 985,
        power: 11,
        trophies: 0
      },
      {
        id: 96,
        card: 994,
        power: 11,
        trophies: 0
      },
      {
        id: 97,
        card: 1035,
        power: 11,
        trophies: 0
      },
      {
        id: 98,
        card: 1043,
        power: 11,
        trophies: 0
      },
      {
        id: 99,
        card: 1056,
        power: 11,
        trophies: 0
      },
      {
        id: 100,
        card: 1064,
        power: 11,
        trophies: 0
      },
      {
        id: 101,
        power: 11,
        trophies: 0,
        card: 1177
      },
      {
        id: 102,
        power: 11,
        trophies: 0,
        card: 1185
      },
      {
        id: 103,
        power: 11,
        trophies: 0,
        card: 1212
      },
      {
        id: 104,
        power: 11,
        trophies: 0,
        card: 1241
      },
      {
        id: 105,
        power: 11,
        trophies: 0,
        card: 1249
      },
      {
        id: 106,
        power: 11,
        trophies: 0,
        card: 1275
      },
      {
        id: 107,
        power: 11,
        trophies: 0,
        card: 1291
      },
      {
        id: 108,
        power: 11,
        trophies: 0,
        card: 1314
      },
      {
        id: 109,
        power: 11,
        trophies: 0,
        card: 1438
      },
      {
        id: 110,
        power: 11,
        trophies: 0,
        card: 1446
      },
      {
        id: 111,
        power: 11,
        trophies: 0,
        card: 1492
      },
      {
        id: 112,
        power: 11,
        trophies: 0,
        card: 1501
      },
      {
        id: 113,
        power: 11,
        trophies: 0,
        card: 1509
      }
    ],
    verbose: true,
    autoUnlockBrawlers: true,
    sendDelayMs: 100
  };

  // src/config.ts
  function validateConfig(value) {
    if (!value || typeof value !== "object") throw new Error("Profile must be an object");
    const c = { ...config_default, ...value };
    const integer = (n, max = 2147483647) => Number.isInteger(n) && Number(n) >= 0 && Number(n) <= max;
    if (!Array.isArray(c.id) || c.id.length !== 2 || !c.id.every((n) => integer(n)))
      throw new Error("Invalid account ID");
    if (typeof c.name !== "string" || !c.name.trim() || c.name.length > 32)
      throw new Error("Invalid player name");
    for (const key of ["country", "creator"])
      if (typeof c[key] !== "string" || c[key].length > 64) throw new Error(`Invalid ${key}`);
    for (const key of [
      "thumbnail",
      "nameColor",
      "favouriteBrawler",
      "gems",
      "coins",
      "bling"
    ])
      if (!integer(c[key])) throw new Error(`Invalid ${key}`);
    if (!integer(c.sendDelayMs, 6e4)) throw new Error("Invalid sendDelayMs");
    if (!c.brawlPass || typeof c.brawlPass.enabled !== "boolean" || typeof c.brawlPass.premium !== "boolean" || !integer(c.brawlPass.season) || !integer(c.brawlPass.points))
      throw new Error("Invalid Brawl Pass settings");
    for (const key of ["selectedSkins", "skinRandomizer", "currentRandomSkins"]) {
      if (!Array.isArray(c[key]) || c[key].length > 2e4 || !c[key].every((n) => integer(n, 999999)) || new Set(c[key]).size !== c[key].length)
        throw new Error(`Invalid ${key}`);
    }
    if (!Array.isArray(c.selectedBrawlers) || c.selectedBrawlers.length !== 3 || !c.selectedBrawlers.every((n) => integer(n, 999999)))
      throw new Error("Invalid selected brawlers");
    if (!Array.isArray(c.brawlers) || c.brawlers.length > 1e3 || !c.brawlers.every(
      (b) => b && integer(b.id, 999999) && integer(b.card, 999999) && integer(b.power, 11) && b.power >= 1 && integer(b.trophies)
    ))
      throw new Error("Invalid brawler inventory");
    if (new Set(c.brawlers.map((b) => b.id)).size !== c.brawlers.length)
      throw new Error("Duplicate brawler");
    if (typeof c.registered !== "boolean" || typeof c.verbose !== "boolean" || typeof c.autoUnlockBrawlers !== "boolean")
      throw new Error("Invalid profile flags");
    return JSON.parse(JSON.stringify(c));
  }
  var defaultConfig = () => validateConfig(config_default);

  // src/accounts/AccountRepository.ts
  function accountKey(id) {
    if (id.length !== 2 || !id.every((n) => Number.isInteger(n) && n >= 0 && n <= 2147483647))
      throw new Error("Invalid account ID");
    return `${id[0]}:${id[1]}`;
  }
  var clone = (value) => JSON.parse(JSON.stringify(value));
  var validToken = (token) => typeof token === "string" && /^[0-9a-f]{64}$/.test(token);
  function readDatabase(data) {
    if (data.format !== 2 || !data.accounts || typeof data.accounts !== "object" || Array.isArray(data.accounts))
      throw new Error("Invalid account database");
    if (data.nameStateVersion !== void 0 && data.nameStateVersion !== 1)
      throw new Error("Invalid name state version");
    const entries = Object.entries(data.accounts);
    if (!entries.length || entries.length > 1e3) throw new Error("Invalid account count");
    const accounts = {};
    const tokens = /* @__PURE__ */ new Set();
    for (const [key, account] of entries) {
      if (!account || !validToken(account.token) || tokens.has(account.token))
        throw new Error("Invalid account token");
      const profile = validateConfig(account.profile);
      if (data.nameStateVersion === void 0 && profile.name === "Offline-v70")
        profile.registered = false;
      if (key !== accountKey(profile.id) || key === "0:0" || !Number.isSafeInteger(account.createdAt) || account.createdAt < 0)
        throw new Error("Invalid account record");
      tokens.add(account.token);
      accounts[key] = { token: account.token, createdAt: account.createdAt, profile };
    }
    if (!Object.hasOwn(accounts, data.activeAccount)) throw new Error("Active account not found");
    return { format: 2, nameStateVersion: 1, activeAccount: data.activeAccount, accounts };
  }
  var AccountRepository = class {
    constructor(data, persist, makeToken, now = Date.now) {
      this.persist = persist;
      this.makeToken = makeToken;
      this.now = now;
      if (data && typeof data === "object" && "format" in data) {
        const db = data;
        this.database = readDatabase(db);
        if (db.nameStateVersion === void 0) this.persist(clone(this.database));
      } else {
        this.database = this.bootstrap(data);
        this.persist(clone(this.database));
      }
      this.config = clone(this.database.accounts[this.database.activeAccount].profile);
    }
    database;
    config;
    bootstrap(data) {
      const profile = data === null ? defaultConfig() : validateConfig(data);
      if (profile.name === "Offline-v70") profile.registered = false;
      const key = accountKey(profile.id);
      if (key === "0:0") throw new Error("Saved account ID cannot be zero");
      return {
        format: 2,
        nameStateVersion: 1,
        activeAccount: key,
        accounts: { [key]: { token: this.newToken(), createdAt: this.now(), profile } }
      };
    }
    newToken() {
      const token = this.makeToken();
      if (!validToken(token)) throw new Error("Token generator must supply 32 random bytes");
      return token;
    }
    get token() {
      return this.database.accounts[this.database.activeAccount].token;
    }
    commit(database) {
      this.persist(clone(database));
      this.database = database;
      this.config = clone(database.accounts[database.activeAccount].profile);
    }
    save() {
      const profile = validateConfig(this.config);
      if (accountKey(profile.id) !== this.database.activeAccount)
        throw new Error("Cannot change the active account ID");
      const next = clone(this.database);
      next.accounts[next.activeAccount].profile = profile;
      this.commit(next);
    }
    create(name) {
      if (Object.keys(this.database.accounts).length >= 1e3)
        throw new Error("Local account limit reached");
      const ids = Object.values(this.database.accounts).map((a) => a.profile.id);
      ids.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      let [high, low] = ids[ids.length - 1];
      if (low === 2147483647) {
        high++;
        low = 0;
      } else low++;
      const id = [high, low];
      accountKey(id);
      const profile = defaultConfig();
      profile.id = id;
      profile.name = name ?? "Player";
      profile.registered = !!name;
      const validated = validateConfig(profile);
      const token = this.newToken();
      if (Object.values(this.database.accounts).some((a) => a.token === token))
        throw new Error("Duplicate generated token");
      const next = clone(this.database);
      const current = validateConfig(this.config);
      if (accountKey(current.id) !== next.activeAccount)
        throw new Error("Cannot change the active account ID");
      next.accounts[next.activeAccount].profile = current;
      next.activeAccount = accountKey(id);
      next.accounts[next.activeAccount] = { token, createdAt: this.now(), profile: validated };
      this.commit(next);
      return id;
    }
    select(id) {
      const key = accountKey(id);
      if (!Object.hasOwn(this.database.accounts, key)) return false;
      this.save();
      const next = clone(this.database);
      next.activeAccount = key;
      this.commit(next);
      return true;
    }
    authenticate(id, token) {
      const key = accountKey(id);
      if (key === "0:0" && !token) {
        this.create();
        return true;
      }
      const account = this.database.accounts[key];
      return !!account && token === account.token && this.select(id);
    }
    getProfile(id) {
      const key = accountKey(id);
      if (key === this.database.activeAccount) return validateConfig(this.config);
      const account = this.database.accounts[key];
      return account ? clone(account.profile) : null;
    }
    list() {
      return Object.entries(this.database.accounts).map(([key, account]) => {
        const profile = key === this.database.activeAccount ? this.config : account.profile;
        return {
          id: [...profile.id],
          name: profile.name,
          createdAt: account.createdAt,
          active: key === this.database.activeAccount
        };
      });
    }
  };

  // src/utility/ProfileStore.ts
  var ProfileStore = class extends AccountRepository {
    path;
    constructor() {
      const libc = Process.getModuleByName("libSystem.B.dylib");
      const getenv = new NativeFunction(libc.getExportByName("getenv"), "pointer", ["pointer"]);
      const home = getenv(Memory.allocUtf8String("HOME")).readUtf8String();
      if (!home) throw new Error("Cannot resolve application HOME");
      const path = home + "/Documents/offline-v70-profile.json";
      const rename = new NativeFunction(libc.getExportByName("rename"), "int", [
        "pointer",
        "pointer"
      ]);
      const access = new NativeFunction(libc.getExportByName("access"), "int", ["pointer", "int"]);
      const random = new NativeFunction(libc.getExportByName("arc4random_buf"), "void", [
        "pointer",
        "ulong"
      ]);
      const persist = (database) => {
        File.writeAllText(path + ".tmp", JSON.stringify(database, null, 2));
        if (rename(Memory.allocUtf8String(path + ".tmp"), Memory.allocUtf8String(path)) !== 0)
          throw new Error("Cannot atomically save accounts");
      };
      const makeToken = () => {
        const bytes = Memory.alloc(32);
        random(bytes, 32);
        return Array.from(new Uint8Array(bytes.readByteArray(32))).map((b) => b.toString(16).padStart(2, "0")).join("");
      };
      const data = access(Memory.allocUtf8String(path), 0) === 0 ? JSON.parse(File.readAllText(path)) : null;
      super(data, persist, makeToken);
      this.path = path;
    }
  };

  // src/battle/knockout/KnockoutMatch.ts
  var knockoutRules = {
    rounds: 3,
    winsRequired: 2,
    betweenRoundsTicks: 60,
    roundLimitTicks: 2400
  };
  var KnockoutMatch = class {
    constructor(tick, rules = knockoutRules, initialDelayTicks = 0) {
      this.rules = rules;
      if (!Number.isInteger(initialDelayTicks) || initialDelayTicks < 0 || !Number.isInteger(tick) || tick < 0 || rules.rounds !== 3 || rules.winsRequired !== 2 || !Number.isInteger(rules.betweenRoundsTicks) || rules.betweenRoundsTicks < 1 || !Number.isInteger(rules.roundLimitTicks) || rules.roundLimitTicks < 1)
        throw new Error("Invalid Knockout rules");
      this.lastTick = tick;
      this.roundStartedAt = tick + initialDelayTicks;
    }
    results = [];
    score = [0, 0];
    phase = "playing";
    winner = null;
    roundStartedAt;
    nextRoundAt = 0;
    prepared = false;
    lastTick;
    get round() {
      return Math.max(
        0,
        Math.min(
          this.results.length - (this.phase === "playing" || this.phase === "intermission" && this.prepared ? 0 : 1),
          this.rules.rounds - 1
        )
      );
    }
    elapsed(tick) {
      return this.phase === "playing" ? Math.max(0, tick - this.roundStartedAt) : 0;
    }
    remaining(tick) {
      return this.phase === "intermission" ? Math.max(1, this.nextRoundAt - tick) : 0;
    }
    update(tick, alive) {
      if (!Number.isInteger(tick) || tick < this.lastTick || alive.some((n) => !Number.isInteger(n) || n < 0 || n > 3))
        throw new Error("Invalid Knockout tick/roster");
      this.lastTick = tick;
      const update = {
        reset: false,
        respawn: false,
        roundEnded: null,
        finished: this.phase === "finished"
      };
      if (this.phase === "finished" || tick < this.roundStartedAt) return update;
      if (this.phase === "intermission") {
        const lead = Math.min(20, this.rules.betweenRoundsTicks - 1);
        if (!this.prepared && tick >= this.nextRoundAt - lead) {
          this.prepared = true;
          update.respawn = true;
        }
        if (tick >= this.nextRoundAt) {
          this.roundStartedAt = tick;
          this.phase = "playing";
          update.reset = true;
        }
        return update;
      }
      let result = null;
      if (alive[0] === 0 && alive[1] === 0) result = 100;
      else if (alive[0] === 0) result = 1;
      else if (alive[1] === 0) result = 0;
      else if (this.elapsed(tick) >= this.rules.roundLimitTicks) result = 100;
      if (result === null) return update;
      this.results.push(result);
      if (result !== 100) this.score[result]++;
      update.roundEnded = result;
      if (this.score[0] >= this.rules.winsRequired || this.score[1] >= this.rules.winsRequired || this.results.length >= this.rules.rounds) {
        this.phase = "finished";
        this.winner = this.score[0] === this.score[1] ? 100 : this.score[0] > this.score[1] ? 0 : 1;
        update.finished = true;
      } else {
        this.phase = "intermission";
        this.prepared = false;
        this.nextRoundAt = tick + this.rules.betweenRoundsTicks;
      }
      return update;
    }
  };

  // src/battle/hooks/LogicBattleModeServer_isGameOver.ts
  function replaceIsGameOver(base, getSession) {
    const address = base.add(platformOffsets.knockout.isGameOver);
    const original = new NativeFunction(address, "int", ["pointer"]);
    const callback = new NativeCallback(
      (battle) => {
        const state = getSession(battle);
        if (state?.hotzone && !state.failed)
          return state.hotzone.match.winner !== null || battle.add(161).readU8() !== 0 || battle.add(249).readU8() !== 0 ? 1 : 0;
        if (!state?.match || state.failed) return original(battle);
        return state.match.phase === "finished" || battle.add(161).readU8() !== 0 || battle.add(249).readU8() !== 0 ? 1 : 0;
      },
      "int",
      ["pointer"]
    );
    Interceptor.replace(address, callback);
    return callback;
  }

  // src/battle/hooks/LogicGameObjectManager_refreshSnapshot.ts
  function createSnapshotRefresh(base) {
    const append = nativeFunctions(base).knockout.appendPointer;
    const scratch = Memory.alloc(Process.pointerSize);
    function refreshSnapshot(manager) {
      const count = manager.add(12).readS32(), objects = manager.readPointer();
      if (count < 0 || count > 2e4) throw new Error("Invalid object count");
      manager.add(241).writeU8(0);
      manager.add(28).writeS32(0);
      for (let i = 0; i < count; i++) {
        scratch.writePointer(objects.add(i * Process.pointerSize).readPointer());
        append(manager.add(16), scratch);
      }
    }
    return refreshSnapshot;
  }

  // src/battle/hooks/LogicCharacter_calculateMovement.ts
  function cancelMovement(hero, tick) {
    hero.add(40).writeS32(tick);
    hero.add(44).writeS32(tick);
    hero.add(1492).writeS32(0);
    hero.add(1500).writeS32(0);
    hero.add(1504).writeS32(0);
    hero.add(1508).writeS32(0);
    hero.add(1516).writeU8(0);
    hero.add(3264).writeS32(0);
  }
  function replaceCalculateMovement(base, paused) {
    const address = base.add(platformOffsets.knockout.calculateMovement);
    return Interceptor.attach(address, {
      onEnter(args) {
        if (paused(args[0])) cancelMovement(args[0], args[1].toInt32());
      }
    });
  }

  // src/battle/hooks/LogicCharacter_activateSkill.ts
  var character = {
    moveStart: 40,
    moveEnd: 44,
    x: 56,
    y: 60,
    health: 1404,
    pathLength: 1492,
    charging: 1652,
    chargeType: 1768,
    chargeSpeed: 1804
  };
  var skillField = {
    chargeType: 536,
    castingTime: 556,
    chargeSpeed: 692,
    behavior: 712
  };
  var duration = (length, speed) => Math.max(1, Math.trunc(20 * length / speed));
  function hasNewPath(hero, tick) {
    return hero.add(character.pathLength).readS32() > 0 && hero.add(character.moveStart).readS32() === tick && hero.add(character.moveEnd).readS32() > tick;
  }
  function applyChargeState(hero, type, speed) {
    hero.add(character.chargeSpeed).writeS32(speed);
    hero.add(character.chargeType).writeS32(type);
    hero.add(character.charging).writeU8(1);
  }
  function chargeTravelSpeed(type, speed) {
    if (type === 16) return Math.max(1, Math.trunc(speed * 0.8));
    if (type === 18 || type === 19) return Math.max(1, Math.trunc(speed * 0.7));
    return speed;
  }
  function chargeTravelLength(type, pathLength) {
    return type === 2 || type === 6 || type === 11 ? 2300 : pathLength;
  }
  function installChargeMovement(base) {
    const native = nativeFunctions(base);
    const pending = /* @__PURE__ */ new Map();
    const active = /* @__PURE__ */ new Map();
    const setPath = native.charge.setPath;
    const directPath = native.charge.directPath;
    const pathLength = native.charge.pathLength;
    const destroyEnvironment = native.charge.destroyEnvironment;
    const wallFailed = /* @__PURE__ */ new Set();
    const breakBullWalls = (battle, hero) => {
      const key = battle.toString();
      if (wallFailed.has(key)) return;
      const map = battle.add(104).readPointer();
      if (map.isNull()) return;
      const width = map.add(212).readS32(), height = map.add(216).readS32();
      if (width < 3 || width > 100 || height < 3 || height > 100) return;
      const x = hero.add(56).readS32(), y = hero.add(60).readS32();
      try {
        destroyEnvironment(
          map,
          x,
          y,
          400,
          0,
          hero.add(160).readS32(),
          hero.add(164).readS32(),
          0,
          0,
          hero.add(32).readPointer()
        );
      } catch (error) {
        wallFailed.add(key);
        console.error(`[offline-v70] Bull wall destruction disabled: ${String(error)}`);
      }
    };
    const startNativePath = (hero, x, y, tick2, speed, type) => {
      setPath(hero, x, y, 1, speed, 0, 0);
      if (!hasNewPath(hero, tick2)) return false;
      const length = hero.add(character.pathLength).readS32();
      hero.add(character.moveEnd).writeS32(tick2 + duration(chargeTravelLength(type, length), speed));
      return true;
    };
    let logged = 0;
    const activation = Interceptor.attach(base.add(platformOffsets.charge.activateSkill), {
      onEnter(args) {
        this.charge = false;
        if (args[0].isNull() || args[1].isNull() || args[1].add(skillField.behavior).readS32() !== 2)
          return;
        const hero = args[0], manager = hero.add(32).readPointer();
        if (manager.isNull()) return;
        const battle = manager.add(296).readPointer();
        if (battle.isNull() || battle.add(240).readU8() !== 1) return;
        this.charge = true;
        this.hero = hero;
        this.skill = args[1];
        this.battle = battle;
        this.x = args[2].toInt32();
        this.y = args[3].toInt32();
        this.originX = hero.add(56).readS32();
        this.originY = hero.add(60).readS32();
      },
      onLeave(retval) {
        if (!this.charge) return;
        const hero = this.hero, skill = this.skill;
        const result = retval.toInt32(), type = skill.add(skillField.chargeType).readS32();
        if (logged++ < 32)
          console.log(
            `[offline-v70] Charge id=${hero.add(8).readS32()} type=${type} result=${result} control=${hero.add(3020).readU8()} flags=${hero.add(1652).readU8()},${hero.add(1653).readU8()} lock=${hero.add(1616).readS32()},${hero.add(1620).readS32()}`
          );
        if (result !== 1 || type === 9 || type < 0 || type > 31) return;
        const speed = skill.add(skillField.chargeSpeed).readS32();
        if (speed <= 0 || speed > 5e4) return;
        const battle = this.battle;
        const castingMs = Math.max(0, skill.add(skillField.castingTime).readS32());
        pending.set(hero.toString(), {
          battle,
          hero,
          type,
          speed,
          due: battle.add(16).readS32() + Math.max(1, Math.ceil(castingMs / 50)),
          x: this.x,
          y: this.y,
          originX: this.originX,
          originY: this.originY
        });
      }
    });
    const tick = Interceptor.attach(base.add(platformOffsets.knockout.step), {
      onEnter(args) {
        const battle = args[0], now = battle.add(16).readS32();
        for (const [key, charge] of active) {
          if (!charge.battle.equals(battle)) continue;
          if (now < charge.end && charge.hero.add(1404).readS32() > 0) {
            if (charge.type === 1) breakBullWalls(battle, charge.hero);
            continue;
          }
          if (charge.type === 10 && !charge.returning && charge.hero.add(1404).readS32() > 0) {
            if (startNativePath(
              charge.hero,
              charge.originX,
              charge.originY,
              now,
              charge.speed,
              charge.type
            )) {
              charge.end = charge.hero.add(character.moveEnd).readS32();
              applyChargeState(charge.hero, charge.type, charge.speed);
              charge.returning = true;
              continue;
            }
          }
          if (charge.hero.add(1652).readU8() === 1 && charge.hero.add(1768).readS32() === charge.type)
            charge.hero.add(1652).writeU8(0);
          active.delete(key);
        }
        for (const [key, charge] of pending) {
          if (!charge.battle.equals(battle)) continue;
          if (now < charge.due) continue;
          pending.delete(key);
          const { hero, x, y, originX, originY, type } = charge;
          const speed = chargeTravelSpeed(type, charge.speed);
          if (hero.add(1404).readS32() <= 0 || hero.add(1652).readU8() === 1) continue;
          const targetX = hero.add(56).readS32() + x - originX;
          const targetY = hero.add(60).readS32() + y - originY;
          if (x === originX && y === originY) continue;
          let pathReady = false;
          if (type === 1) {
            const map = battle.add(104).readPointer();
            if (!map.isNull()) {
              directPath(hero, targetX, targetY, map);
              const length = pathLength(hero.add(1344), hero.add(1360));
              if (length > 0) {
                pathReady = true;
                hero.add(1492).writeS32(length);
                hero.add(40).writeS32(now);
                hero.add(character.moveEnd).writeS32(now + duration(length, speed));
                hero.add(1500).writeS32(0);
                hero.add(1504).writeS32(0);
                hero.add(1508).writeS32(0);
                hero.add(1516).writeU8(0);
                breakBullWalls(battle, hero);
              }
            }
          } else {
            pathReady = startNativePath(hero, targetX, targetY, now, speed, type);
          }
          if (!pathReady) continue;
          const end = hero.add(character.moveEnd).readS32();
          if (end > now && hero.add(character.pathLength).readS32() > 0) {
            applyChargeState(hero, type, speed);
            active.set(key, { battle, hero, end, type, speed, originX, originY, returning: false });
          }
          if (logged < 40)
            console.log(
              `[offline-v70] Charge path id=${hero.add(8).readS32()} type=${type} length=${hero.add(1492).readS32()} ticks=${end - now} aim=${targetX},${targetY}`
            );
        }
      }
    });
    const destroy = Interceptor.attach(base.add(platformOffsets.knockout.destructor), {
      onEnter(args) {
        const battle = args[0];
        for (const [key, charge] of pending) if (charge.battle.equals(battle)) pending.delete(key);
        for (const [key, charge] of active) if (charge.battle.equals(battle)) active.delete(key);
        wallFailed.delete(battle.toString());
      }
    });
    return [activation, tick, destroy];
  }

  // src/battle/hooks/LogicBot_tick.ts
  function replaceBotTick(base, paused) {
    const address = base.add(platformOffsets.knockout.botTick);
    const original = new NativeFunction(address, "void", ["pointer"]);
    const callback = new NativeCallback(
      (bot) => {
        if (!paused(bot.add(48).readPointer())) original(bot);
      },
      "void",
      ["pointer"]
    );
    Interceptor.replace(address, callback);
    return callback;
  }

  // src/battle/hotzone/HotZoneMatch.ts
  var HotZoneMatch = class {
    constructor(zones, startTick, endTick, ticksPerPoint = 12) {
      this.zones = zones;
      this.startTick = startTick;
      this.endTick = endTick;
      this.ticksPerPoint = ticksPerPoint;
      if (!zones.length || zones.length > 3 || zones.some(
        (z) => !Number.isFinite(z.x) || !Number.isFinite(z.y) || !Number.isFinite(z.radius) || z.radius <= 0
      ) || endTick <= startTick || !Number.isInteger(ticksPerPoint) || ticksPerPoint < 1)
        throw new Error("Invalid Hot Zone rules");
      this.zoneTarget = Math.floor(100 / zones.length);
      this.captureTicks = zones.map(() => [0, 0]);
      this.occupied = zones.map(() => [false, false]);
    }
    captureTicks;
    occupied;
    zoneTarget;
    winner = null;
    lastTick = -1;
    zoneScore(zone, team) {
      return Math.min(
        this.zoneTarget,
        Math.floor(this.captureTicks[zone][team] / this.ticksPerPoint)
      );
    }
    zonePercent(zone, team) {
      return Math.floor(this.zoneScore(zone, team) * 100 / this.zoneTarget);
    }
    score(team) {
      return this.zones.reduce((total, _, i) => total + this.zoneScore(i, team), 0);
    }
    percent(team) {
      return Math.floor(this.score(team) * 100 / (this.zoneTarget * this.zones.length));
    }
    update(tick, players, doubled = false) {
      if (this.winner !== null || tick <= this.lastTick) return;
      this.lastTick = tick;
      if (tick < this.startTick) return;
      if (tick < this.endTick)
        this.zones.forEach((zone, i) => {
          const inside = [false, false];
          for (const player of players) {
            if (player.team !== 0 && player.team !== 1 || !player.alive || player.z > 0 || player.inRealm)
              continue;
            if ((player.x - zone.x) ** 2 + (player.y - zone.y) ** 2 <= zone.radius ** 2)
              inside[player.team] = true;
          }
          this.occupied[i] = inside;
          for (const team of [0, 1])
            if (inside[team])
              this.captureTicks[i][team] = Math.min(
                this.zoneTarget * this.ticksPerPoint,
                this.captureTicks[i][team] + (doubled ? 2 : 1)
              );
        });
      const target = this.zoneTarget * this.zones.length, a = this.score(0), b = this.score(1);
      if (a === target || b === target || tick >= this.endTick)
        this.winner = a === b ? 100 : a > b ? 0 : 1;
    }
  };

  // src/battle/hotzone/HotZoneSimulation.ts
  var HotZoneSimulation = class {
    constructor(base, results) {
      this.base = base;
      this.results = results;
      const native = nativeFunctions(base);
      this.getTable = native.table.get;
      this.item = native.table.item;
      this.create = native.hotzone.create;
      this.position = native.hotzone.position;
      this.add = native.hotzone.add;
      this.trigger = native.hotzone.trigger;
      this.radius = native.hotzone.radius;
      this.duration = native.hotzone.duration;
      this.controlStart = native.knockout.controlStart;
      this.modifier = native.hotzone.modifier;
      this.find = native.knockout.findObject;
      this.allocate = native.messaging.allocate;
    }
    getTable;
    item;
    create;
    position;
    add;
    trigger;
    radius;
    duration;
    controlStart;
    modifier;
    find;
    allocate;
    effect(battle, name, x, y, team, catalog) {
      const id = catalog.get(name);
      if (id === void 0) throw new Error(`Missing Hot Zone effect ${name}`);
      const data = this.item(this.getTable(17), id);
      if (data.isNull()) throw new Error(`Missing Hot Zone data ${id}`);
      const area = this.create(data, NULL);
      if (area.isNull()) throw new Error("Cannot allocate Hot Zone effect");
      this.position(area, x, y, 0);
      area.add(160).writeS32(team < 0 ? -1 : 15);
      area.add(164).writeS32(team);
      area.add(168).writeS32(0);
      this.add(battle.readPointer(), area);
      this.trigger(area);
      return area;
    }
    catalog = null;
    vector(battle, offset, values) {
      const field = battle.add(offset);
      if (field.add(8).readS32() < values.length) {
        if (!field.readPointer().isNull()) throw new Error("Unexpected existing Hot Zone vector");
        const memory = this.allocate(values.length * 4);
        if (memory.isNull()) throw new Error("Cannot allocate Hot Zone scores");
        field.writePointer(memory);
        field.add(8).writeS32(values.length);
      }
      field.add(12).writeS32(values.length);
      values.forEach(
        (value, i) => field.readPointer().add(i * 4).writeS32(value)
      );
    }
    initialize(battle) {
      const rows = new ClientData(this.base).rows(17, ["Name"]);
      if (!rows) throw new Error("Area effects are not loaded");
      this.catalog = new Map(rows.map((row) => [row.values.Name, row.id]));
      for (const name of [
        "KingOfHillArea",
        "KingOfHillAreaGauge",
        "KingOfHillAreaCapture",
        "KingOfHillAreaComplete"
      ])
        if (!this.catalog.has(name)) throw new Error(`Missing Hot Zone effect ${name}`);
      const map = battle.add(104).readPointer(), layout2 = map.add(120).readPointer();
      const width = map.add(212).readS32(), height = map.add(216).readS32();
      const count = layout2.add(36).readS32(), cells = layout2.add(24).readPointer();
      if (width < 1 || height < 1 || width * height !== count || count > 2e4)
        throw new Error("Invalid Hot Zone map");
      const markers = [];
      for (let i = 0; i < count; i++) if (cells.add(i * 4).readS32() === 56) markers.push(i);
      if (!markers.length || markers.length > 3)
        throw new Error("Hot Zone requires 1..3 zone markers");
      if (battle.add(916).readS32() !== 0) throw new Error("Hot Zone already initialized");
      const effects = markers.map((index) => {
        const x = index % width * 300 + 150, y = Math.floor(index / width) * 300 + 150;
        return {
          area: this.effect(battle, "KingOfHillArea", x, y, -1, this.catalog),
          gauges: [0, 1].map(
            (team) => this.effect(battle, "KingOfHillAreaGauge", x, y, team, this.catalog)
          ),
          capture: [NULL, NULL],
          complete: [NULL, NULL]
        };
      });
      this.vector(battle, 856, markers);
      this.vector(
        battle,
        904,
        effects.map((e) => e.area.add(8).readS32())
      );
      this.vector(
        battle,
        920,
        markers.map(() => 0)
      );
      this.vector(
        battle,
        936,
        markers.map(() => 0)
      );
      this.vector(
        battle,
        968,
        markers.map(() => 0)
      );
      const match = new HotZoneMatch(
        effects.map((e) => ({
          x: e.area.add(56).readS32(),
          y: e.area.add(60).readS32(),
          radius: this.radius(e.area)
        })),
        this.controlStart(battle),
        this.duration(battle.add(224).readPointer()) - 1
      );
      console.log(
        `[offline-v70] Hot Zone: ${effects.length} zones, ${match.zoneTarget} points per zone`
      );
      return { match, effects };
    }
    update(battle, state) {
      const { match, effects } = state, players = [];
      const count = battle.add(96).readS32(), roster2 = battle.add(112).readPointer();
      if (count < 1 || count > 10) throw new Error("Invalid Hot Zone roster");
      for (let i = 0; i < count; i++) {
        const player = roster2.add(i * 8).readPointer(), hero = this.find(battle.readPointer(), player.add(112).readS32());
        if (hero.isNull()) continue;
        players.push({
          team: player.add(108).readS32(),
          x: hero.add(56).readS32(),
          y: hero.add(60).readS32(),
          z: hero.add(64).readS32(),
          alive: hero.add(1404).readS32() > 0,
          inRealm: hero.add(168).readS32() !== 0
        });
      }
      match.update(battle.add(16).readS32(), players, !!this.modifier(battle, 37));
      for (const team of [0, 1]) {
        this.vector(
          battle,
          team === 0 ? 936 : 968,
          effects.map((_, i) => match.zoneScore(i, team))
        );
        effects.forEach((effect, i) => {
          const zone = match.zones[i], completed = match.zoneScore(i, team) === match.zoneTarget;
          const capturing = match.winner === null && match.occupied[i][team] && !completed;
          if (capturing && effect.capture[team].isNull())
            effect.capture[team] = this.effect(
              battle,
              "KingOfHillAreaCapture",
              zone.x,
              zone.y,
              team,
              this.catalog
            );
          if (!capturing && !effect.capture[team].isNull()) {
            effect.capture[team].add(412).writeU8(1);
            effect.capture[team] = NULL;
          }
          if (!effect.gauges[team].isNull())
            effect.gauges[team].add(328).writeS32(match.zonePercent(i, team));
          if (completed && effect.complete[team].isNull()) {
            effect.gauges[team].add(412).writeU8(1);
            effect.gauges[team] = NULL;
            effect.complete[team] = this.effect(
              battle,
              "KingOfHillAreaComplete",
              zone.x,
              zone.y,
              team,
              this.catalog
            );
          }
        });
      }
      if (match.winner !== null) {
        battle.add(272).writeS32(match.winner);
        this.results?.finishTeamMatch(battle.toString(), 17, match.winner);
      }
    }
  };

  // src/battle/PlayerState.ts
  function syncPlayerAlive(player, hero, _tick) {
    const alive = !hero.isNull() && hero.add(1404).readS32() > 0;
    player.add(168).writeU8(alive ? 1 : 0);
    return alive;
  }

  // src/battle/hooks/LogicBattleModeServer_tickTurrets.ts
  var LogicBattleModeServerTickTurrets = class {
    constructor(base) {
      this.base = base;
      const native = nativeFunctions(base);
      this.getTable = native.table.get;
      this.item = native.table.item;
      this.createNativeAura = native.turret.createAura;
      this.position = native.hotzone.position;
    }
    catalog = null;
    failed = /* @__PURE__ */ new Set();
    getTable;
    item;
    createNativeAura;
    position;
    load() {
      if (this.catalog) return this.catalog;
      const rows = new ClientData(this.base).rows(16, ["Type", "AreaEffect"]);
      const areas = new ClientData(this.base).rows(17, ["Name"]);
      if (!rows || !areas) return null;
      const names = new Map(areas.map((row) => [row.values.Name, row.id]));
      const characters = this.getTable(16), effects = this.getTable(17);
      if (characters.isNull() || effects.isNull()) return null;
      const catalog = /* @__PURE__ */ new Map();
      for (const row of rows) {
        if (!row.values.Type.startsWith("Minion_") || !row.values.AreaEffect) continue;
        const areaId = names.get(row.values.AreaEffect);
        if (areaId === void 0) continue;
        const character2 = this.item(characters, row.id), effect = this.item(effects, areaId);
        if (!character2.isNull() && !effect.isNull()) catalog.set(character2.toString(), effect);
      }
      this.catalog = catalog;
      return catalog;
    }
    update(battle, auras) {
      const catalog = this.load();
      if (!catalog?.size) return;
      const manager = battle.readPointer(), count = manager.add(12).readS32(), objects = manager.readPointer();
      if (count < 0 || count > 2e4 || count > 0 && objects.isNull())
        throw new Error("Invalid turret object list");
      const active = /* @__PURE__ */ new Map();
      for (let i = 0; i < count; i++) {
        const object = objects.add(i * Process.pointerSize).readPointer();
        if (!object.isNull()) active.set(object.toString(), object);
      }
      for (const [key, aura] of auras) {
        const turret = active.get(key);
        if (turret && turret.add(1404).readS32() > 0 && active.has(aura.toString())) {
          this.position(
            aura,
            turret.add(56).readS32(),
            turret.add(60).readS32(),
            turret.add(64).readS32()
          );
        } else {
          if (active.has(aura.toString())) aura.add(412).writeU8(1);
          auras.delete(key);
        }
      }
      for (const [key, turret] of active) {
        const characterData = turret.add(16).readPointer();
        if (characterData.isNull()) continue;
        const effectData = catalog.get(characterData.toString());
        if (!effectData || turret.add(1404).readS32() <= 0 || auras.has(key) || this.failed.has(key))
          continue;
        const world = turret.add(32).readPointer();
        if (world.isNull() || !world.equals(manager)) continue;
        const owner = turret.add(160).readS32(), team = turret.add(164).readS32();
        if (owner < 0 || owner >= 10 || team < 0 || team > 1) continue;
        let nativeAura = false;
        for (const other of active.values()) {
          if (other.add(16).readPointer().equals(effectData) && other.add(432).readPointer().equals(turret)) {
            nativeAura = true;
            break;
          }
        }
        if (nativeAura) continue;
        try {
          const aura = this.createNativeAura(
            turret,
            effectData,
            turret.add(56).readS32(),
            turret.add(60).readS32(),
            0,
            0,
            NULL
          );
          if (aura.isNull()) throw new Error("Native aura returned null");
          auras.set(key, aura);
        } catch (error) {
          this.failed.add(key);
          console.error(
            `[offline-v70] Turret aura disabled id=${turret.add(8).readS32()} data=${characterData} effect=${effectData}: ${String(error)}`
          );
        }
      }
    }
  };

  // src/battle/hooks/LogicBattleModeServer_tick.ts
  function respawnDelaySeconds(battle) {
    if (battle.add(220).readS32() === 20) return 0;
    const mode = battle.add(224).readPointer();
    const seconds = mode.isNull() ? 0 : mode.add(816).readS32();
    return seconds > 0 && seconds <= 30 ? seconds : 0;
  }
  function respawnRoster(battle) {
    const count = battle.add(96).readS32();
    const players = battle.add(112).readPointer();
    if (count < 1 || count > 10 || players.isNull()) throw new Error("Invalid respawn roster");
    return { count, players };
  }
  var LogicBattleModeServerTick = class {
    sessions = /* @__PURE__ */ new Map();
    hooks = [];
    callbacks = [];
    lastStatus = null;
    lastHotZoneStatus = null;
    constructor(base, onError, results) {
      const N = platformOffsets.knockout;
      const native = nativeFunctions(base);
      let hotzone = null;
      let turrets = null;
      const controlStart = native.knockout.controlStart;
      const findObject = native.knockout.findObject;
      const clearObjects = native.knockout.clearObjects;
      const resetMap = native.knockout.resetMap;
      const arrange = native.knockout.arrange;
      const spawn = native.knockout.spawn;
      const spawnSaved = (args, x, y, z) => spawn(
        args[0],
        args[1],
        args[2],
        args[3],
        args[4].toUInt32(),
        args[5].toUInt32(),
        args[6].toInt32(),
        args[7].toInt32() & 255,
        x >>> 0,
        y >>> 0,
        z >>> 0,
        args[11].toUInt32(),
        args[12].toUInt32()
      );
      const updatePositions = native.knockout.updatePositions;
      const allocate = native.messaging.allocate;
      const eligible = (battle) => !battle.isNull() && battle.add(220).readS32() === 20 && battle.add(240).readU8() === 1;
      const session = (battle) => {
        const key = battle.toString();
        let state = this.sessions.get(key);
        if (!state) {
          state = {
            battle,
            match: null,
            spawns: /* @__PURE__ */ new Map(),
            homes: /* @__PURE__ */ new Map(),
            deaths: /* @__PURE__ */ new Map(),
            turretAuras: /* @__PURE__ */ new Map(),
            failed: false
          };
          this.sessions.set(key, state);
        }
        return state;
      };
      const fail = (state, error) => {
        state.failed = true;
        onError(new Error(`Knockout: ${String(error)}`));
      };
      this.hooks.push(
        Interceptor.attach(base.add(N.constructor), {
          onEnter: (args) => {
            this.sessions.delete(args[0].toString());
            this.lastStatus = null;
            this.lastHotZoneStatus = null;
            results?.begin(args[0].toString());
          }
        })
      );
      this.hooks.push(
        Interceptor.attach(base.add(N.destructor), {
          onEnter: (args) => {
            this.sessions.delete(args[0].toString());
          }
        })
      );
      this.hooks.push(
        Interceptor.attach(base.add(N.spawnCharacter), {
          onEnter(args) {
            if (args[0].add(240).readU8() !== 1) return;
            const state = session(args[0]);
            const index = args[4].toInt32();
            if (index >= 0 && index < 10) {
              const saved = Array.from({ length: 8 }, (_, i) => ptr(args[i].toString()));
              saved.push(
                ptr(this.context.sp.readU32()),
                ptr(this.context.sp.add(4).readU32()),
                ptr(this.context.sp.add(8).readU32()),
                ptr(this.context.sp.add(12).readU8()),
                ptr(this.context.sp.add(13).readU8())
              );
              state.spawns.set(index, saved);
            }
          }
        })
      );
      this.hooks.push(
        Interceptor.attach(base.add(N.arrangePlayers), {
          onEnter(args) {
            this.battle = args[0];
          },
          onLeave: function() {
            const battle = this.battle;
            if (battle.add(240).readU8() !== 1) return;
            const state = session(battle);
            try {
              const count = battle.add(96).readS32(), players = battle.add(112).readPointer();
              if (count < 1 || count > 10 || players.isNull())
                throw new Error("Invalid offline roster");
              for (let i = 0; i < count; i++) {
                const player = players.add(i * 8).readPointer();
                if (player.isNull()) throw new Error("Missing offline player");
                results?.record(
                  battle.toString(),
                  battle.add(220).readS32(),
                  i,
                  player.add(108).readS32(),
                  player.add(169).readU8() !== 0
                );
                const hero = findObject(battle.readPointer(), player.add(112).readS32());
                if (!hero.isNull() && !state.homes.has(i))
                  state.homes.set(i, [
                    hero.add(56).readS32(),
                    hero.add(60).readS32(),
                    hero.add(64).readS32()
                  ]);
              }
            } catch (e) {
              onError(new Error(`Battle roster: ${String(e)}`));
            }
            if (battle.add(240).readU8() === 1 && battle.add(220).readS32() === 17) {
              if (!state.hotzone && !state.failed)
                try {
                  hotzone ??= new HotZoneSimulation(base, results);
                  state.hotzone = hotzone.initialize(battle);
                } catch (e) {
                  state.failed = true;
                  onError(new Error(`Hot Zone: ${String(e)}`));
                }
              return;
            }
            if (!eligible(battle)) return;
            if (state.match || state.failed) return;
            try {
              if (battle.add(96).readS32() !== 6 || state.spawns.size !== 6)
                throw new Error("Knockout requires two complete teams of three");
              if (!battle.add(1080).readPointer().isNull())
                throw new Error("Unexpected existing Knockout round vector");
              const rounds = allocate(12);
              if (rounds.isNull()) throw new Error("Cannot allocate Knockout results");
              for (let i = 0; i < 3; i++) rounds.add(i * 4).writeS32(-1);
              battle.add(1080).writePointer(rounds);
              battle.add(1088).writeS32(3);
              battle.add(1092).writeS32(3);
              const tick = battle.add(16).readS32();
              state.match = new KnockoutMatch(
                tick,
                knockoutRules,
                Math.max(0, controlStart(battle) - tick)
              );
              console.log("[offline-v70] Knockout: 3v3, best of 3");
            } catch (e) {
              fail(state, e);
            }
          }
        })
      );
      const getSession = (battle) => this.sessions.get(battle.toString());
      this.callbacks.push(replaceIsGameOver(base, getSession));
      const pausedBot = (hero) => {
        if (hero.isNull() || hero.add(1609).readU8() !== 1) return false;
        const manager = hero.add(32).readPointer();
        if (manager.isNull()) return false;
        const state = getSession(manager.add(296).readPointer());
        return !!state?.match && !state.failed && state.match.phase !== "playing";
      };
      this.hooks.push(replaceCalculateMovement(base, pausedBot));
      this.hooks.push(...installChargeMovement(base));
      this.callbacks.push(replaceBotTick(base, pausedBot));
      const refreshSnapshot = createSnapshotRefresh(base);
      const self = this;
      this.hooks.push(
        Interceptor.attach(base.add(N.step), {
          onEnter(args) {
            const battle = args[0];
            this.battle = battle;
            const state = self.sessions.get(battle.toString());
            if (!state || state.match || state.failed || battle.add(240).readU8() !== 1) return;
            try {
              const seconds = respawnDelaySeconds(battle);
              if (!seconds || !state.deaths.size) return;
              if (battle.add(161).readU8() !== 0 || battle.add(249).readU8() !== 0 || state.hotzone && state.hotzone.match.winner !== null)
                return;
              const tick = battle.add(16).readS32();
              const { count, players } = respawnRoster(battle);
              for (let i = 0; i < count; i++) {
                const died = state.deaths.get(i), saved = state.spawns.get(i), home = state.homes.get(i);
                if (died === void 0 || tick - died < seconds * 20 || !saved || !home) continue;
                const player = players.add(i * 8).readPointer();
                const oldHero = findObject(battle.readPointer(), player.add(112).readS32());
                if (syncPlayerAlive(player, oldHero, tick)) {
                  state.deaths.delete(i);
                  continue;
                }
                const body = spawnSaved(saved, home[0], home[1], home[2]);
                if (body.isNull()) throw new Error(`Failed to respawn player ${i}`);
                player.add(112).writeS32(body.add(8).readS32());
                player.add(168).writeU8(1);
                state.deaths.delete(i);
              }
            } catch (e) {
              state.failed = true;
              onError(new Error(`Respawn: ${String(e)}`));
            }
          },
          onLeave() {
            const battle = this.battle;
            const state = self.sessions.get(battle.toString());
            if (state && !state.failed && !state.turretEffectsFailed && battle.add(240).readU8() === 1) {
              try {
                turrets ??= new LogicBattleModeServerTickTurrets(base);
                turrets.update(battle, state.turretAuras);
              } catch (e) {
                state.turretEffectsFailed = true;
                onError(new Error(`Turret effects disabled for this battle: ${String(e)}`));
              }
            }
            if (state && !state.match && !state.failed && battle.add(240).readU8() === 1) {
              try {
                const seconds = respawnDelaySeconds(battle);
                if (seconds && state.homes.size) {
                  const tick = battle.add(16).readS32();
                  const { count, players } = respawnRoster(battle);
                  for (let i = 0; i < count; i++) {
                    const saved = state.spawns.get(i), home = state.homes.get(i);
                    if (!saved || !home) continue;
                    const player = players.add(i * 8).readPointer();
                    const hero = findObject(battle.readPointer(), player.add(112).readS32());
                    if (syncPlayerAlive(player, hero, tick)) {
                      state.deaths.delete(i);
                      continue;
                    }
                    if (!state.deaths.has(i)) state.deaths.set(i, tick);
                  }
                }
              } catch (e) {
                state.failed = true;
                onError(new Error(`Respawn: ${String(e)}`));
              }
            }
            if (state?.hotzone && !state.failed) {
              try {
                hotzone.update(battle, state.hotzone);
                self.lastHotZoneStatus = {
                  score: [state.hotzone.match.percent(0), state.hotzone.match.percent(1)],
                  zones: state.hotzone.match.zones.length,
                  winner: state.hotzone.match.winner
                };
              } catch (e) {
                state.failed = true;
                onError(new Error(`Hot Zone: ${String(e)}`));
              }
              return;
            }
            if (!state?.match || state.failed) return;
            try {
              const match = state.match, tick = battle.add(16).readS32();
              const players = battle.add(112).readPointer();
              const alive = [0, 0];
              for (let i = 0; i < 6; i++) {
                const player = players.add(i * 8).readPointer();
                const team = player.add(108).readS32();
                if (team !== 0 && team !== 1) throw new Error("Invalid Knockout team");
                const hero = findObject(battle.readPointer(), player.add(112).readS32());
                if (syncPlayerAlive(player, hero, tick)) alive[team]++;
              }
              const change = match.update(tick, alive);
              if (match.phase === "finished" && match.winner !== null)
                results?.finishKnockout(battle.toString(), match.winner);
              if (change.respawn) {
                clearObjects(battle.readPointer());
                resetMap(battle, 6, 1);
                for (let i = 0; i < 6; i++) {
                  const args = state.spawns.get(i);
                  const hero = spawnSaved(
                    args,
                    args[8].toUInt32(),
                    args[9].toUInt32(),
                    args[10].toUInt32()
                  );
                  if (hero.isNull()) throw new Error("Failed to respawn Knockout hero");
                  const player = players.add(i * 8).readPointer();
                  player.add(112).writeS32(hero.add(8).readS32());
                  player.add(168).writeU8(1);
                }
                arrange(battle, 0, NULL, NULL, NULL, NULL);
                updatePositions(battle);
                refreshSnapshot(battle.readPointer());
              }
              if (match.phase !== "playing") {
                for (let i = 0; i < 6; i++) {
                  const player = players.add(i * 8).readPointer();
                  const hero = findObject(battle.readPointer(), player.add(112).readS32());
                  if (pausedBot(hero)) cancelMovement(hero, tick);
                }
              }
              const roundResults = battle.add(1080).readPointer();
              for (let i = 0; i < 3; i++) roundResults.add(i * 4).writeS32(match.results[i] ?? -1);
              battle.add(304).writeS32(match.round);
              battle.add(308).writeS32(match.elapsed(tick));
              battle.add(300).writeS32(match.remaining(tick));
              battle.add(312).writeU8(match.phase !== "playing" ? 1 : 0);
              self.lastStatus = {
                phase: match.phase,
                round: match.round + 1,
                score: [...match.score],
                results: [...match.results],
                winner: match.winner,
                elapsedTicks: match.elapsed(tick)
              };
              if (change.roundEnded !== null)
                console.log(
                  `[offline-v70] Knockout round: ${change.roundEnded}; score ${match.score.join(":")}`
                );
            } catch (e) {
              fail(state, e);
            }
          }
        })
      );
    }
    hotZoneStatus() {
      return this.lastHotZoneStatus;
    }
    status() {
      return this.lastStatus;
    }
  };

  // src/init.ts
  var initialized = false;
  var failure = null;
  var messaging = null;
  var roster = null;
  var knockout = null;
  var buildId = false ? "development" : "954b1640b0c3";
  function report(e) {
    failure = e instanceof Error ? e.stack || String(e) : String(e);
    console.error("[offline-v70]", failure);
  }
  var observer = Process.attachModuleObserver({
    onAdded(module) {
      if (module.name !== "laser" || initialized || failure) return;
      try {
        verifyImage(module);
        const store = new ProfileStore();
        messaging = new Messaging(module.base, store);
        installHooks(module.base, messaging, report);
        roster = new LogicBattleModeServerAddPlayer(module.base, report, messaging.battleResults);
        knockout = new LogicBattleModeServerTick(module.base, report, messaging.battleResults);
        initialized = true;
        console.log(`[offline-v70] Ready; build: ${buildId}; profile: ${store.path}`);
      } catch (e) {
        report(e);
      }
    }
  });
  rpc.exports = {
    status: () => ({
      version: 70,
      buildId,
      platform: "ios-arm64",
      initialized,
      failure,
      sent: messaging?.sent ?? 0,
      received: messaging?.received ?? 0,
      lastUnhandled: messaging?.lastUnhandled ?? null,
      profile: messaging?.store.path ?? null,
      accountId: messaging?.store.config.id ?? null,
      sendDelayMs: messaging?.store.config.sendDelayMs ?? 100,
      brawlers: messaging?.store.config.brawlers.length ?? 0,
      brawlPass: messaging?.store.config.brawlPass ?? null,
      knockout: knockout?.status() ?? null,
      hotzone: knockout?.hotZoneStatus() ?? null,
      pendingResponses: messaging?.pendingResponses ?? 0
    }),
    createaccount: (name) => {
      if (!messaging) throw new Error("Agent is not initialized");
      return messaging.createAccount(name);
    },
    accounts: () => messaging?.store.list() ?? [],
    selectaccount: (high, low) => {
      if (!messaging) throw new Error("Agent is not initialized");
      return messaging.selectAccount([high, low]);
    },
    profile: (high, low) => {
      if (!messaging) throw new Error("Agent is not initialized");
      return messaging.store.getProfile([high, low]);
    }
  };
})();
