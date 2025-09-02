import { describe, it, expect } from 'vitest';
import { RNG, dateSeed } from '../src/rng';

describe('RNG date seed repeatability', () => {
  it('same YYYYMMDD produces same first ten values', () => {
    const fixed = new Date(2025, 7, 29); // months 0-based
    const seed = dateSeed(fixed);
    const a = new RNG(seed);
    const b = new RNG(seed);
    const arrA = Array.from({ length: 10 }, () => a.random());
    const arrB = Array.from({ length: 10 }, () => b.random());
    expect(arrA).toEqual(arrB);
  });
});
