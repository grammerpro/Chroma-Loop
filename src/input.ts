export class Input {
  left = false;
  right = false;
  dragging = false;
  deltaX = 0;
  lastX = 0;

  constructor() {
    this.init();
  }

  init() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.left = true;
      if (e.key === 'ArrowRight') this.right = true;
    });
    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft') this.left = false;
      if (e.key === 'ArrowRight') this.right = false;
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
    // Reset delta
    this.deltaX = 0;
  }
}
