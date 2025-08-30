import { describe, it, expect } from 'vitest';
import { RNG } from '../src/rng';

describe('RNG', () => {
  it('should generate deterministic values with seed', () => {
    const rng1 = new RNG(12345);
    const rng2 = new RNG(12345);
    expect(rng1.random()).toBe(rng2.random());
  });

  it('should generate values between 0 and 1', () => {
    const rng = new RNG();
    for (let i = 0; i < 100; i++) {
      const val = rng.random();
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(1);
    }
  });
});
