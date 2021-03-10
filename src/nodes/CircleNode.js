export default class CircleNode {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  render(context) {
    context.save();
    context.fillStyle = 'red';
    context.beginPath();
    context.ellipse(this.x, this.y, RADIUS, RADIUS, 0, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
}

const RADIUS = 20;