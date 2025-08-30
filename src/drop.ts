export class Drop {
  angle: number;
  speed: number;
  color: number;
  isStar: boolean;
  y = 0;

  constructor(angle: number, speed: number, color: number, isStar: boolean) {
    this.angle = angle;
    this.speed = speed;
    this.color = color;
    this.isStar = isStar;
  }

  update(dt: number) {
    this.y += this.speed * dt / 1000;
  }

  draw(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
    const x = cx + Math.cos(this.angle) * this.y;
    const yPos = cy - Math.sin(this.angle) * this.y;
    ctx.beginPath();
    ctx.arc(x, yPos, 5, 0, Math.PI * 2);
    ctx.fillStyle = this.isStar ? '#ffff00' : this.getColor();
    ctx.fill();
  }

  getColor(): string {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080'];
    return colors[this.color % colors.length];
  }
}
