import { Circle } from '../shapes';

export default class CircleNode {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.shape = new Circle(this, RADIUS, 'rgb(255, 252, 56)');
  }
}

const RADIUS = 20;