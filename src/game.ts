import { Ring } from './ring';
import { Drop } from './drop';
import { Input } from './input';
import { AudioManager } from './audio';
import { UI } from './ui';
import { RNG } from './rng';

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ring: Ring;
  drops: Drop[] = [];
  input: Input;
  audio: AudioManager;
  ui: UI;
  rng: RNG;
  score = 0;
  lives = 3;
  streak = 0;
  level = 1;
  sectors = 4;
  mode: 'daily' | 'endless' = 'endless';
  slowMotion = false;
  slowMotionTime = 0;
  lastTime = 0;
  paused = false;
  gameOver = false;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.ring = new Ring(this.sectors);
    this.input = new Input();
    this.audio = new AudioManager();
    this.ui = new UI(this);
    this.rng = new RNG();
    this.init();
  }

  init() {
    this.loadSettings();
    this.ui.showMenu();
  }

  start() {
    this.gameLoop(0);
  }

  gameLoop(time: number) {
    const delta = time - this.lastTime;
    this.lastTime = time;

    this.update(delta);
    this.draw();

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  update(delta: number) {
    if (this.paused || this.gameOver) return;

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
      const speed = 100 + this.level * 10;
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
          this.score += 10 * (this.streak + 1);
          this.streak++;
          this.audio.play('match');
          if (drop.isStar) {
            this.slowMotion = true;
            this.slowMotionTime = 2000;
            this.score += 50;
            this.audio.play('star');
          }
        } else {
          this.lives--;
          this.streak = 0;
          this.audio.play('miss');
          if (this.lives <= 0) {
            this.gameOver = true;
            this.ui.showGameOver();
          }
        }
        this.drops.splice(i, 1);
      }
    }

    // Increase difficulty
    if (this.score > this.level * 100) {
      this.level++;
      if (this.sectors < 8) this.sectors++;
      this.ring.setSectors(this.sectors);
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
    // Load from localStorage
  }

  saveSettings() {
    // Save to localStorage
  }
}
