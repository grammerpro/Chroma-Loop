export class RNG {
  seed: number;

  constructor(seed?: number) {
    this.seed = seed ?? Date.now();
  }

  setSeed(seed: number) {
    this.seed = seed >>> 0;
  }

  random(): number {
    // Simple LCG (deterministic)
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

export function dateSeed(d = new Date()): number {
  // YYYYMMDD
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}
