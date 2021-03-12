import { Circle } from '../shapes';

export default class CircleNode {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.shape = new Circle(this, RADIUS, 'red')
  }
}

const RADIUS = 20;