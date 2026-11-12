import { MessageManager } from './message/MessageManager';
import { PiranhaMessage } from './piranhamessage';
import { ProfileStore } from './utility/ProfileStore';
import { OwnHomeDataMessage } from './packets/server/OwnHomeDataMessage';
import { LoginOkMessage } from './packets/server/LoginOkMessage';
import { layout, nativeFunctions } from './offsets';
import { prepareInventory } from './battle/Inventory';
import { ResponseQueue } from './message/ResponseQueue';
import { AuthenticationFailedMessage } from './packets/server/AuthenticationFailedMessage';
import { ClientData } from './battle/ClientData';
import { OfflineBattleResults } from './battle/OfflineBattleResults';
import type { SelectionCatalog } from './Commands/LogicCommand';
import { unlockedSkins } from './battle/SkinInventory';
import { EventRotation } from './events/EventRotation';
import { battleLocationMaps, selectionCatalog } from './battle/BattleCatalog';

export class Messaging {
  private queue: ResponseQueue;
  readonly battleResults = new OfflineBattleResults();
  loginRequested = false;
  private create;
  private allocate;
  private setBuffer;
  private receive;
  sent = 0;
  received = 0;
  readonly messageManager: MessageManager;
  get lastUnhandled(): number | null {
    return this.messageManager.lastUnhandled;
  }
  private inventoryReady = false;
  private skinIds: number[] = [];
  private selectionCatalog: SelectionCatalog | undefined;
  private eventRotation: EventRotation | null = null;
  private resultModes = new Map<number, number>();
  private resultVariations = new Map<number, number>();
  constructor(
    private base: NativePointer,
    readonly store: ProfileStore,
    now: () => number = Date.now,
  ) {
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
      getProfile: id => this.store.getProfile(id),
      prepareBattleResult: (message, variation) => this.battleResults.prepare(message, variation),
      getBattleMode: location =>
        location[0] === 15 ? (this.resultModes.get(location[1]) ?? 1) : 1,
      getBattleVariation: location => {
        const variation = location[0] === 15 ? this.resultVariations.get(location[1]) : undefined;
        if (variation === undefined)
          throw new Error(`Unknown battle location ${location.join(':')}`);
        return variation;
      },
    });
    const native = nativeFunctions(base).messaging;
    this.create = native.create;
    this.allocate = native.allocate;
    this.setBuffer = native.setBuffer;
    this.receive = native.receive;
  }
  enqueue(type: number, payload: number[]) {
    this.queue.enqueue(type, payload, this.store.config.sendDelayMs ?? 100);
  }
  home() {
    if (!this.eventRotation) throw new Error('Event tables are not ready');
    const now = Date.now();
    this.enqueue(
      24101,
      OwnHomeDataMessage.encode(
        this.store.config,
        this.eventRotation.generate(now),
        now,
        this.skinIds,
      ),
    );
  }
  prepare(): boolean {
    if (this.inventoryReady) return true;
    const data = new ClientData(this.base);
    const locations = data.rows(15, ['Name', 'Map', 'GameModeVariation', 'Disabled']);
    const modes = data.rows(48, ['Name', 'Disabled', 'Variation']);
    const skins = data.rows(29, [
      'Name',
      'Conf',
      'Disabled',
      'ProgressionSkinBase',
      'ProgressionSkinLevel',
    ]);

    const confs = data.rows(44, ['Name', 'Character']);
    const characters = data.rows(16, ['Name', 'Type', 'Disabled']);
    const thumbnails = data.rows(28, ['Disabled']);
    const nameColors = data.rows(43, ['Disabled']);
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
      this.skinIds,
    );
    for (const key of ['selectedSkins', 'skinRandomizer', 'currentRandomSkins'] as const)
      this.store.config[key] = this.store.config[key].filter(id => owned.has(id));
    console.log(
      `[offline-v70] ${this.skinIds.length} skins; progression groups use the highest level`,
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
  get pendingResponses(): number {
    return this.queue.length;
  }
  login() {
    this.enqueue(20104, LoginOkMessage.encode(this.store.config.id, this.store.token));
    this.home();
    this.loginRequested = false;
  }
  private accountChanged(): void {
    this.battleResults.reset();
    this.queue.clear();
    this.inventoryReady = false;
    this.loginRequested = true;
  }
  createAccount(name?: string) {
    const id = this.store.create(name);
    this.accountChanged();
    return { id, name: this.store.config.name };
  }
  selectAccount(id: readonly number[]): boolean {
    if (!this.store.select(id)) return false;
    this.accountChanged();
    return true;
  }
  private authenticate(id: readonly number[], token: string | null): void {
    if (this.store.authenticate(id, token)) this.accountChanged();
    else {
      const response = new AuthenticationFailedMessage();
      this.enqueue(response.type, response.encode());
    }
  }
  flush(manager: NativePointer) {
    const batch = this.queue.drain();
    for (const { type, payload } of batch) this.sendOfflineMessage(manager, type, payload);
  }
  private sendOfflineMessage(manager: NativePointer, type: number, payload: number[]) {
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
      if (buffer.isNull()) throw new Error('Native allocation failed');
      if (payload.length) buffer.writeByteArray(payload);

      this.setBuffer(message.add(layout.byteStream), buffer, payload.length);
      new NativeFunction(message.readPointer().add(layout.decode).readPointer(), 'void', [
        'pointer',
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
  handle(type: number, payload: number[]) {
    this.received++;
    const c = this.store.config;
    if (c.verbose && type !== 14102)
      console.log(`[offline-v70] C ${type} (${payload.length} bytes)`);
    this.messageManager.handle(type, payload);
  }
}
