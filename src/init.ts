import { LogicBattleModeServerAddPlayer } from './battle/hooks/LogicBattleModeServer_addPlayer';
import { verifyImage } from './Definitions';
import { installHooks } from './mainHooks';
import { Messaging } from './Messaging';
import { ProfileStore } from './utility/ProfileStore';
import { LogicBattleModeServerTick } from './battle/hooks/LogicBattleModeServer_tick';

let initialized = false,
  failure: string | null = null,
  messaging: Messaging | null = null;
let roster: LogicBattleModeServerAddPlayer | null = null;
let knockout: LogicBattleModeServerTick | null = null;
const buildId = typeof __OFFLINE_BUILD_ID__ === 'undefined' ? 'development' : __OFFLINE_BUILD_ID__;
function report(e: unknown) {
  failure = e instanceof Error ? e.stack || String(e) : String(e);
  console.error('[offline-v70]', failure);
}
const observer = Process.attachModuleObserver({
  onAdded(module) {
    if (module.name !== 'laser' || initialized || failure) return;
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
  },
});
rpc.exports = {
  status: () => ({
    version: 70,
    buildId,
    platform: 'ios-arm64',
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
    pendingResponses: messaging?.pendingResponses ?? 0,
  }),
  createaccount: (name?: string) => {
    if (!messaging) throw new Error('Agent is not initialized');
    return messaging.createAccount(name);
  },
  accounts: () => messaging?.store.list() ?? [],
  selectaccount: (high: number, low: number) => {
    if (!messaging) throw new Error('Agent is not initialized');
    return messaging.selectAccount([high, low]);
  },
  profile: (high: number, low: number) => {
    if (!messaging) throw new Error('Agent is not initialized');
    return messaging.store.getProfile([high, low]);
  },
};
