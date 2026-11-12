import { ClientData } from '../ClientData';
import { nativeFunctions } from '../../offsets';

export type TurretAuras = Map<string, NativePointer>;

export class LogicBattleModeServerTickTurrets {
  private catalog: Map<string, NativePointer> | null = null;
  private failed = new Set<string>();
  private getTable;
  private item;
  private createNativeAura;
  private position;

  constructor(private base: NativePointer) {
    const native = nativeFunctions(base);
    this.getTable = native.table.get;
    this.item = native.table.item;
    this.createNativeAura = native.turret.createAura;
    this.position = native.hotzone.position;
  }

  private load(): Map<string, NativePointer> | null {
    if (this.catalog) return this.catalog;
    const rows = new ClientData(this.base).rows(16, ['Type', 'AreaEffect']);
    const areas = new ClientData(this.base).rows(17, ['Name']);
    if (!rows || !areas) return null;
    const names = new Map(areas.map(row => [row.values.Name, row.id]));
    const characters = this.getTable(16),
      effects = this.getTable(17);
    if (characters.isNull() || effects.isNull()) return null;
    const catalog = new Map<string, NativePointer>();
    for (const row of rows) {
      if (!row.values.Type.startsWith('Minion_') || !row.values.AreaEffect) continue;
      const areaId = names.get(row.values.AreaEffect);
      if (areaId === undefined) continue;
      const character = this.item(characters, row.id),
        effect = this.item(effects, areaId);
      if (!character.isNull() && !effect.isNull()) catalog.set(character.toString(), effect);
    }
    this.catalog = catalog;
    return catalog;
  }

  update(battle: NativePointer, auras: TurretAuras): void {
    const catalog = this.load();
    if (!catalog?.size) return;
    const manager = battle.readPointer(),
      count = manager.add(12).readS32(),
      objects = manager.readPointer();
    if (count < 0 || count > 20000 || (count > 0 && objects.isNull()))
      throw new Error('Invalid turret object list');
    const active = new Map<string, NativePointer>();
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
          turret.add(64).readS32(),
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
      const owner = turret.add(160).readS32(),
        team = turret.add(164).readS32();
      if (owner < 0 || owner >= 10 || team < 0 || team > 1) continue;
      let nativeAura = false;
      for (const other of active.values()) {
        if (
          other.add(16).readPointer().equals(effectData) &&
          other.add(432).readPointer().equals(turret)
        ) {
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
          NULL,
        );
        if (aura.isNull()) throw new Error('Native aura returned null');
        auras.set(key, aura);
      } catch (error) {
        this.failed.add(key);
        console.error(
          `[offline-v70] Turret aura disabled id=${turret.add(8).readS32()}` +
            ` data=${characterData} effect=${effectData}: ${String(error)}`,
        );
      }
    }
  }
}
