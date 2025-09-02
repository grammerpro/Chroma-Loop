export class UI {
  game: any;
  menuVisible = true;
  settingsVisible = false;
  gameOverVisible = false;
  pauseVisible = false;
  tutorialVisible = false;
  buttons: any[] = [];
  hudScoreEl: HTMLElement | null = null;
  hudLivesEl: HTMLElement | null = null;
  liveRegionEl: HTMLElement | null = null;
  uiContainerEl: HTMLElement | null = null;

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
  this.hudScoreEl = document.getElementById('hudScore');
  this.hudLivesEl = document.getElementById('hudLives');
  this.liveRegionEl = document.getElementById('live-region');
  this.uiContainerEl = document.getElementById('ui');
  this.updateHUD();
  }

  showMenu() {
    this.menuVisible = true;
  this.gameOverVisible = false;
  this.pauseVisible = false;
  this.settingsVisible = false;
  this.buttons = [];
  this.renderMenuUI();
  }

  hideMenu() {
    this.menuVisible = false;
  this.buttons = [];
  this.clearUI();
  }

  showSettings() {
    this.settingsVisible = true;
  this.renderSettingsUI();
  }

  showGameOver() {
    this.gameOverVisible = true;
  this.buttons = [];
  this.renderGameOverUI();
  }

  showPause() {
    this.pauseVisible = true;
  this.buttons = [];
  this.renderPauseUI();
  }

  hidePause() {
    this.pauseVisible = false;
  this.buttons = [];
  this.clearUI();
  }

  renderMenuUI() {
    this.setUI([
      this.makeButton('Start Daily', () => this.game.startDaily(), 'Start daily seeded run'),
      this.makeButton('Start Endless', () => this.game.startEndless(), 'Start endless run'),
      this.makeButton('Settings', () => this.showSettings(), 'Open settings'),
      this.makeInfo(`Best Endless: ${this.game.bestEndless}`),
      this.makeInfo(`Best Daily: ${this.game.bestDaily}`),
    ]);
  }

  renderSettingsUI() {
    const muted = this.game.audio.muted;
    const reduced = this.game.reducedMotion;
    const muteToggle = this.makeToggle('Mute audio', muted, (checked) => {
      this.game.audio.setMuted(checked);
      this.game.saveSettings();
    });
    const rmToggle = this.makeToggle('Reduced motion', reduced, (checked) => {
      this.game.reducedMotion = checked;
      this.game.saveSettings();
    });
    this.setUI([
      muteToggle,
      rmToggle,
      this.makeButton('Back', () => this.showMenu(), 'Back to menu'),
    ]);
  }

  renderGameOverUI() {
    const info = this.makeInfo(`Final Score: ${this.game.score}`);
    const best = this.makeInfo(`Best: ${this.game.mode === 'endless' ? this.game.bestEndless : this.game.bestDaily}`);
    this.setUI([
      this.makeHeading('Game Over'),
      info,
      best,
      this.makeButton('Restart', () => this.game.startGame(this.game.mode), 'Restart run'),
      this.makeButton('Menu', () => this.game.returnToMenu(), 'Back to menu'),
    ]);
  }

  renderPauseUI() {
    this.setUI([
      this.makeHeading('Paused'),
      this.makeButton('Resume', () => this.game.resume(), 'Resume game'),
      this.makeButton('Menu', () => this.game.returnToMenu(), 'Back to menu'),
    ]);
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
      this.drawTutorial();
    } else if (this.game.state === 'playing') {
      this.drawHUD(ctx);
    }

  // DOM-based buttons handled via this.uiContainerEl
  }

  updateHUD() {
    if (this.hudScoreEl) this.hudScoreEl.textContent = `Score: ${this.game.score} · x${this.game.streak}`;
    if (this.hudLivesEl) this.hudLivesEl.textContent = '♥'.repeat(this.game.lives);
  }

  announce(msg: string) {
    if (this.liveRegionEl) this.liveRegionEl.textContent = msg;
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

  drawTutorial() {
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

  // DOM UI helpers as class methods
  clearUI() {
    if (!this.uiContainerEl) return;
    this.uiContainerEl.innerHTML = '';
    this.uiContainerEl.setAttribute('style', 'display:none');
  }

  setUI(elements: HTMLElement[]) {
    if (!this.uiContainerEl) return;
    this.uiContainerEl.innerHTML = '';
    for (const el of elements) this.uiContainerEl.appendChild(el);
    this.uiContainerEl.setAttribute('style', 'display:flex');
  }

  makeButton(text: string, onClick: () => void, aria?: string) {
    const btn = document.createElement('button');
    btn.className = 'ui-button';
    btn.type = 'button';
    btn.textContent = text;
    if (aria) btn.setAttribute('aria-label', aria);
    btn.addEventListener('click', () => onClick());
    onKeyActivate(btn, onClick);
    return btn;
  }

  makeInfo(text: string) {
    const div = document.createElement('div');
    div.style.color = '#fff';
    div.style.textAlign = 'center';
    div.textContent = text;
    return div;
  }

  makeHeading(text: string) {
    const h = document.createElement('div');
    h.style.color = '#fff';
    h.style.font = '28px Arial, sans-serif';
    h.style.textAlign = 'center';
    h.setAttribute('role', 'heading');
    h.textContent = text;
    return h;
  }

  makeToggle(label: string, checked: boolean, onChange: (checked: boolean) => void) {
    const wrapper = document.createElement('label');
    wrapper.style.color = '#fff';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '8px';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = checked;
    input.addEventListener('change', () => onChange(input.checked));
    const span = document.createElement('span');
    span.textContent = label;
    wrapper.appendChild(input);
    wrapper.appendChild(span);
    return wrapper;
  }
}

// DOM helpers
function onKeyActivate(el: HTMLElement, handler: () => void) {
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handler();
    }
  });
}
