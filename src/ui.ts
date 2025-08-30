export class UI {
  game: any;
  menuVisible = true;
  settingsVisible = false;
  gameOverVisible = false;
  pauseVisible = false;
  tutorialVisible = false;
  buttons: Button[] = [];

  constructor(game: any) {
    this.game = game;
    this.init();
  }

  init() {
    // Check if tutorial seen
    if (!localStorage.getItem('tutorialSeen')) {
      this.tutorialVisible = true;
      localStorage.setItem('tutorialSeen', 'true');
    }
  }

  showMenu() {
    this.menuVisible = true;
    this.gameOverVisible = false;
    this.pauseVisible = false;
    this.settingsVisible = false;
    this.createMenuButtons();
  }

  hideMenu() {
    this.menuVisible = false;
    this.buttons = [];
  }

  showSettings() {
    this.settingsVisible = true;
    this.createSettingsButtons();
  }

  showGameOver() {
    this.gameOverVisible = true;
    this.createGameOverButtons();
  }

  showPause() {
    this.pauseVisible = true;
    this.createPauseButtons();
  }

  hidePause() {
    this.pauseVisible = false;
    this.buttons = [];
  }

  createMenuButtons() {
    this.buttons = [
      new Button('Start Daily', this.game.canvas.width / 2 - 100, 180, 200, 40, () => this.game.startDaily()),
      new Button('Start Endless', this.game.canvas.width / 2 - 100, 230, 200, 40, () => this.game.startEndless()),
      new Button('Settings', this.game.canvas.width / 2 - 100, 280, 200, 40, () => this.showSettings()),
    ];
  }

  createSettingsButtons() {
    this.buttons = [
      new Button('Back', this.game.canvas.width / 2 - 100, 300, 200, 40, () => this.showMenu()),
    ];
  }

  createGameOverButtons() {
    this.buttons = [
      new Button('Restart', this.game.canvas.width / 2 - 100, 230, 200, 40, () => this.game.startGame(this.game.mode)),
      new Button('Menu', this.game.canvas.width / 2 - 100, 280, 200, 40, () => this.game.returnToMenu()),
    ];
  }

  createPauseButtons() {
    this.buttons = [
      new Button('Resume', this.game.canvas.width / 2 - 100, 200, 200, 40, () => this.game.resume()),
      new Button('Menu', this.game.canvas.width / 2 - 100, 250, 200, 40, () => this.game.returnToMenu()),
    ];
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.menuVisible) {
      this.drawMenu(ctx);
    } else if (this.settingsVisible) {
      this.drawSettings(ctx);
    } else if (this.gameOverVisible) {
      this.drawGameOver(ctx);
    } else if (this.pauseVisible) {
      this.drawPause(ctx);
    } else if (this.tutorialVisible) {
      this.drawTutorial(ctx);
    } else if (this.game.state === 'playing') {
      this.drawHUD(ctx);
    }

    // Draw buttons
    for (const button of this.buttons) {
      button.draw(ctx);
    }
  }

  drawMenu(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Chroma Loop', ctx.canvas.width / 2, 100);
    ctx.font = '16px Arial';
    ctx.fillText(`Best Endless: ${this.game.bestEndless}`, ctx.canvas.width / 2, 130);
    ctx.fillText(`Best Daily: ${this.game.bestDaily}`, ctx.canvas.width / 2, 150);
  }

  drawSettings(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Settings', ctx.canvas.width / 2, 100);
    // Add settings options here
  }

  drawGameOver(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', ctx.canvas.width / 2, 100);
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${this.game.score}`, ctx.canvas.width / 2, 150);
    ctx.fillText(`Best: ${this.game.mode === 'endless' ? this.game.bestEndless : this.game.bestDaily}`, ctx.canvas.width / 2, 180);
  }

  drawPause(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Paused', ctx.canvas.width / 2, 150);
  }

  drawTutorial(ctx: CanvasRenderingContext2D) {
    // Draw tutorial overlay
  }

  drawHUD(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${this.game.score}`, 10, 30);
    ctx.fillText(`Streak: ${this.game.streak}`, 10, 60);

    // Draw lives as hearts
    for (let i = 0; i < this.game.lives; i++) {
      ctx.fillText('♥', 10 + i * 25, 90);
    }
  }
}

class Button {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  onClick: () => void;
  hovered = false;

  constructor(text: string, x: number, y: number, width: number, height: number, onClick: () => void) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.onClick = onClick;
    this.init();
  }

  init() {
    window.addEventListener('pointerdown', (e) => {
      if (this.isInside(e.clientX, e.clientY)) {
        this.onClick();
      }
    });
    window.addEventListener('pointermove', (e) => {
      this.hovered = this.isInside(e.clientX, e.clientY);
    });
  }

  isInside(x: number, y: number): boolean {
    return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.hovered ? '#666' : '#333';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2 + 5);
  }
}
