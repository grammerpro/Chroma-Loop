export class RNG {
  seed: number;

  constructor(seed?: number) {
    this.seed = seed || Date.now();
  }

  setSeed(seed: number) {
    this.seed = seed;
  }

  random(): number {
    // Simple LCG
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}
