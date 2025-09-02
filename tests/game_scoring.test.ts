import { describe, it, expect } from 'vitest';
import { Game } from '../src/game';

class CtxStub {
  canvas = { width: 300, height: 300 } as HTMLCanvasElement;
  clearRect() {}
}

function createGame() {
  const canvas = document.createElement('canvas');
  canvas.width = 300; canvas.height = 300;
  const ctx = canvas.getContext('2d')!;
  // Shim minimal methods used in tests
  return new Game(canvas, ctx);
}

describe('Game scoring', () => {
  it('onMatch adds 10 * streak and increases streak up to cap', () => {
    const g = createGame();
    g.state = 'playing';
    g.score = 0; g.streak = 1;
    g.onMatch(false);
    expect(g.score).toBe(10);
    expect(g.streak).toBe(2);
    // ramp streak
    for (let i = 0; i < 20; i++) g.onMatch(false);
    expect(g.streak).toBeLessThanOrEqual(g.STREAK_CAP);
  });

  it('onMiss decrements lives and resets streak to 1; ends run at 0', () => {
    const g = createGame();
    g.state = 'playing';
    g.lives = 1;
    g.onMiss();
    expect(g.lives).toBe(0);
    expect(g.state).toBe('gameOver');
  });
});
