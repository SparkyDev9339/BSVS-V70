export interface QueuedResponse {
  type: number;
  payload: number[];
  readyAt: number;
}

export class ResponseQueue {
  private queue: QueuedResponse[] = [];
  constructor(private readonly now: () => number = Date.now) {}
  get length(): number {
    return this.queue.length;
  }
  enqueue(type: number, payload: number[], delayMs: number): void {
    if (!Number.isInteger(delayMs) || delayMs < 0 || delayMs > 60000)
      throw new Error('Invalid response delay');
    if (this.queue.length >= 256) throw new Error('Offline response queue overflow');
    const previous = this.queue[this.queue.length - 1]?.readyAt ?? 0;
    this.queue.push({
      type,
      payload: [...payload],
      readyAt: Math.max(this.now() + delayMs, previous),
    });
  }
  drain(): QueuedResponse[] {
    const now = this.now();
    let count = 0;
    while (count < this.queue.length && this.queue[count].readyAt <= now) count++;
    return this.queue.splice(0, count);
  }
  clear(): void {
    this.queue = [];
  }
}
