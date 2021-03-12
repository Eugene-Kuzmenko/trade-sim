import { ShapeTypes } from '../enums';

export default class Circle {
  constructor(anchor, radius, fillStyle) {
    this.type = ShapeTypes.CIRCLE;
    this.radius = radius;
    this.fillStyle = fillStyle;
    this.anchor = anchor;
  }

  get x() {
    return this.anchor.x;
  }

  get y() {
    return this.anchor.y;
  }
}