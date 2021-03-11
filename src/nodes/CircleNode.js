export default class CircleNode {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  render(layer) {
    layer.drawCircle(this.x, this.y, RADIUS, 'red');
  }
}

const RADIUS = 20;