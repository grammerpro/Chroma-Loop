export class UI {
  game: any;
  menuVisible = true;
  settingsVisible = false;
  gameOverVisible = false;
  tutorialVisible = false;

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
  }

  showSettings() {
    this.settingsVisible = true;
  }

  showGameOver() {
    this.gameOverVisible = true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.menuVisible) {
      this.drawMenu(ctx);
    } else if (this.settingsVisible) {
      this.drawSettings(ctx);
    } else if (this.gameOverVisible) {
      this.drawGameOver(ctx);
    } else if (this.tutorialVisible) {
      this.drawTutorial(ctx);
    } else {
      this.drawHUD(ctx);
    }
  }

  drawMenu(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Chroma Loop', ctx.canvas.width / 2, 100);
    ctx.font = '20px Arial';
    ctx.fillText('Start Daily', ctx.canvas.width / 2, 200);
    ctx.fillText('Start Endless', ctx.canvas.width / 2, 250);
    ctx.fillText('Settings', ctx.canvas.width / 2, 300);
  }

  drawSettings(ctx: CanvasRenderingContext2D) {
    // Similar to menu
  }

  drawGameOver(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', ctx.canvas.width / 2, 100);
    ctx.fillText(`Score: ${this.game.score}`, ctx.canvas.width / 2, 150);
    ctx.fillText('Restart', ctx.canvas.width / 2, 250);
    ctx.fillText('Menu', ctx.canvas.width / 2, 300);
  }

  drawTutorial(ctx: CanvasRenderingContext2D) {
    // Draw tutorial overlay
  }

  drawHUD(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${this.game.score}`, 10, 30);
    ctx.fillText(`Lives: ${this.game.lives}`, 10, 60);
    ctx.fillText(`Streak: ${this.game.streak}`, 10, 90);
  }
}
