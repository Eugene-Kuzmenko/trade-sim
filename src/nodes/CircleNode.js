import { AnchoredCircle } from '../render/shapes';

export default class CircleNode {
  constructor(x, y, color='rgb(255, 252, 56)') {
    this.x = x;
    this.y = y;
    this.shape = new AnchoredCircle(this, RADIUS, color);
  }

  update() {}
}

const RADIUS = 20;