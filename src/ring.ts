export class Ring {
  sectors: number;
  radius: number;
  rotation = 0;
  targetRotation = 0;
  snap = false;

  constructor(sectors: number) {
    this.sectors = sectors;
    this.radius = 100;
  }

  setSectors(sectors: number) {
    this.sectors = sectors;
  }

  update(dt: number, input: any) {
    if (input.dragging) {
      this.targetRotation += input.deltaX * 0.01;
    }
    if (input.left) this.targetRotation += dt * 0.005;
    if (input.right) this.targetRotation -= dt * 0.005;

    if (this.snap) {
      const sectorAngle = (Math.PI * 2) / this.sectors;
      this.targetRotation = Math.round(this.targetRotation / sectorAngle) * sectorAngle;
    }

    this.rotation += (this.targetRotation - this.rotation) * 0.1;
  }

  getSectorAtAngle(angle: number): number {
    const adjustedAngle = (angle - this.rotation + Math.PI * 2) % (Math.PI * 2);
    return Math.floor(adjustedAngle / (Math.PI * 2 / this.sectors));
  }

  draw(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
    const sectorAngle = Math.PI * 2 / this.sectors;
    for (let i = 0; i < this.sectors; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, this.radius, this.rotation + i * sectorAngle, this.rotation + (i + 1) * sectorAngle);
      ctx.arc(cx, cy, this.radius - 20, this.rotation + (i + 1) * sectorAngle, this.rotation + i * sectorAngle, true);
      ctx.closePath();
      ctx.fillStyle = this.getColor(i);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  getColor(index: number): string {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080'];
    return colors[index % colors.length];
  }

  resize(size: number) {
    this.radius = size * 0.3;
  }
}
