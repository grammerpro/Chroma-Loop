import { Ring } from './ring';
import { Drop } from './drop';
import { Input } from './input';
import { AudioManager } from './audio';
import { UI } from './ui';
import { RNG } from './rng';
import { Storage } from './storage';

export type GameState = 'title' | 'playing' | 'paused' | 'gameOver';

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ring: Ring;
  drops: Drop[] = [];
  input: Input;
  audio: AudioManager;
  ui: UI;
  rng: RNG;
  storage: Storage;
  score = 0;
  lives = 3;
  streak = 1;
  level = 1;
  sectors = 4;
  mode: 'daily' | 'endless' = 'endless';
  slowMotion = false;
  slowMotionTime = 0;
  lastTime = 0;
  state: GameState = 'title';
  bestEndless = 0;
  bestDaily = 0;
  catches = 0;

  // Constants
  readonly STREAK_CAP = 10;
  readonly DIFFICULTY_RAMP = 20;
  readonly SPEED_INCREASE = 10;
  readonly SECTOR_INCREASES = [4, 6, 8];

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.ring = new Ring(this.sectors);
    this.input = new Input();
    this.audio = new AudioManager();
    this.ui = new UI(this);
    this.rng = new RNG();
    this.storage = new Storage();
    this.init();
  }

  init() {
    this.loadSettings();
    this.bestEndless = this.storage.getNumber('cl_best_endless');
    this.bestDaily = this.storage.getNumber('cl_best_daily');
    this.state = 'title';
    this.ui.showMenu();
  }

  start() {
    this.gameLoop(0);
  }

  gameLoop(time: number) {
    const delta = time - this.lastTime;
    this.lastTime = time;

    if (this.input.pausePressed) {
      this.pause();
    }
    if (this.input.resumePressed) {
      this.resume();
    }

    this.update(delta);
    this.draw();

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  update(delta: number) {
    if (this.state !== 'playing') return;

    let dt = delta;
    if (this.slowMotion) {
      dt *= 0.3;
      this.slowMotionTime -= delta;
      if (this.slowMotionTime <= 0) {
        this.slowMotion = false;
      }
    }

    this.input.update();
    this.ring.update(dt, this.input);

    // Spawn drops
    if (this.rng.random() < 0.02 * this.level) {
      const angle = this.rng.random() * Math.PI * 2;
      const speed = 100 + this.level * this.SPEED_INCREASE;
      const color = Math.floor(this.rng.random() * this.sectors);
      const isStar = this.rng.random() < 0.1;
      this.drops.push(new Drop(angle, speed, color, isStar));
    }

    // Update drops
    for (let i = this.drops.length - 1; i >= 0; i--) {
      const drop = this.drops[i];
      drop.update(dt);
      if (drop.y > this.canvas.height / 2 + 50) {
        const sector = this.ring.getSectorAtAngle(drop.angle);
        if (sector === drop.color) {
          this.onMatch(drop.isStar);
        } else {
          this.onMiss();
        }
        this.drops.splice(i, 1);
      }
    }

    this.updateDifficulty();
  }

  updateDifficulty() {
    if (this.catches % this.DIFFICULTY_RAMP === 0 && this.catches > 0) {
      this.level++;
      const sectorIndex = Math.min(Math.floor(this.catches / (this.DIFFICULTY_RAMP * 2)), this.SECTOR_INCREASES.length - 1);
      this.sectors = this.SECTOR_INCREASES[sectorIndex];
      this.ring.setSectors(this.sectors);
    }
  }

  onMatch(isStar: boolean) {
    this.score += 10 * this.streak;
    this.catches++;
    this.audio.playMatch();
    if (this.streak < this.STREAK_CAP) {
      this.streak++;
      if (this.streak > 1) {
        this.audio.playStreak();
      }
    }
    if (isStar) {
      this.slowMotion = true;
      this.slowMotionTime = 2000;
      this.score += 50;
    }
  }

  onMiss() {
    this.lives--;
    this.streak = 1;
    this.audio.playMiss();
    if (this.lives <= 0) {
      this.endRun();
    }
  }

  endRun() {
    this.state = 'gameOver';
    this.ui.showGameOver();
    if (this.mode === 'endless' && this.score > this.bestEndless) {
      this.bestEndless = this.score;
      this.storage.setNumber('cl_best_endless', this.bestEndless);
    } else if (this.mode === 'daily' && this.score > this.bestDaily) {
      this.bestDaily = this.score;
      this.storage.setNumber('cl_best_daily', this.bestDaily);
    }
  }

  startDaily() {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    this.rng.setSeed(seed);
    this.startGame('daily');
  }

  startEndless() {
    this.rng.setSeed(Date.now());
    this.startGame('endless');
  }

  startGame(mode: 'daily' | 'endless') {
    this.mode = mode;
    this.state = 'playing';
    this.score = 0;
    this.lives = 3;
    this.streak = 1;
    this.level = 1;
    this.sectors = 4;
    this.catches = 0;
    this.drops = [];
    this.ring.setSectors(this.sectors);
    this.ui.hideMenu();
  }

  returnToMenu() {
    this.state = 'title';
    this.drops = [];
    this.ui.showMenu();
  }

  pause() {
    if (this.state === 'playing') {
      this.state = 'paused';
      this.ui.showPause();
    }
  }

  resume() {
    if (this.state === 'paused') {
      this.state = 'playing';
      this.ui.hidePause();
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ring.draw(this.ctx, this.canvas.width / 2, this.canvas.height / 2);
    for (const drop of this.drops) {
      drop.draw(this.ctx, this.canvas.width / 2, this.canvas.height / 2);
    }
    this.ui.draw(this.ctx);
  }

  resize(size: number) {
    this.ring.resize(size);
  }

  loadSettings() {
    this.audio.setMuted(this.storage.getBoolean('cl_audio_muted', false));
    // Load other settings
  }

  saveSettings() {
    this.storage.setBoolean('cl_audio_muted', this.audio.muted);
    // Save other settings
  }
}
