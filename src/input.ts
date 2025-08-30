export class Input {
  left = false;
  right = false;
  dragging = false;
  deltaX = 0;
  lastX = 0;
  pausePressed = false;
  resumePressed = false;

  constructor() {
    this.init();
  }

  init() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.left = true;
      if (e.key === 'ArrowRight') this.right = true;
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        this.pausePressed = true;
      }
    });
    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft') this.left = false;
      if (e.key === 'ArrowRight') this.right = false;
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        this.pausePressed = false;
        this.resumePressed = true;
      }
    });
    window.addEventListener('pointerdown', (e) => {
      this.dragging = true;
      this.lastX = e.clientX;
    });
    window.addEventListener('pointermove', (e) => {
      if (this.dragging) {
        this.deltaX = e.clientX - this.lastX;
        this.lastX = e.clientX;
      }
    });
    window.addEventListener('pointerup', () => {
      this.dragging = false;
      this.deltaX = 0;
    });
  }

  update() {
    // Reset delta and pressed flags
    this.deltaX = 0;
    this.resumePressed = false;
  }
}
