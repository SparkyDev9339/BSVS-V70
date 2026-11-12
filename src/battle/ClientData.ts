import { nativeFunctions } from '../offsets';

export interface ClientRow {
  id: number;
  values: Record<string, string>;
}

export class ClientData {
  private getTable;
  constructor(base: NativePointer) {
    this.getTable = nativeFunctions(base).table.get;
  }
  private string(value: NativePointer): string {
    const length = value.add(4).readS32();
    if (length < 0 || length > 4096) throw new Error('Invalid CSV String length');
    return (length >= 8 ? value.add(8).readPointer() : value.add(8)).readUtf8String(length) ?? '';
  }
  rows(type: number, fields: readonly string[]): ClientRow[] | null {
    const table = this.getTable(type);
    if (table.isNull()) return null;
    const count = table.add(20).readS32();
    if (!count) return null;
    if (count < 0 || count > 20000) throw new Error(`Invalid CSV table ${type} size`);
    const items = table.add(8).readPointer();
    const csv = items.readPointer().add(8).readPointer().readPointer();
    const columns = new Map<string, number>();
    let node = csv.add(16).readPointer();
    for (let i = 0; !node.isNull(); i++, node = node.readPointer()) {
      if (i >= 1024) throw new Error('Invalid CSV column chain');
      columns.set(this.string(node.add(16)), node.add(32).readS32());
    }
    return Array.from({ length: count }, (_, i) => {
      const data = items.add(i * 8).readPointer();
      const row = data.add(8).readPointer().add(8).readS32();
      const values: Record<string, string> = {};
      for (const field of fields) {
        const column = columns.get(field);
        if (column === undefined) {
          values[field] = '';
          continue;
        }
        const cell = csv
          .add(56)
          .readPointer()
          .add(column * 8)
          .readPointer();
        switch (cell.readS32()) {
          case 0:
            values[field] = this.string(
              cell
                .add(8)
                .readPointer()
                .add(row * 16),
            );
            break;
          case 1:
            values[field] = String(
              cell
                .add(24)
                .readPointer()
                .add(row * 4)
                .readS32(),
            );
            break;
          case 2:
            values[field] = String(cell.add(40).readPointer().add(row).readU8());
            break;
          case 3:
            values[field] = String(
              cell
                .add(56)
                .readPointer()
                .add(row * 4)
                .readFloat(),
            );
            break;
          default:
            throw new Error('Invalid CSV column type');
        }
      }
      return { id: data.add(32).readS32() - type * 1000000, values };
    });
  }
}
