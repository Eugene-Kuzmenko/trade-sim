import { ShapeTypes, FillTypes } from '../enums';

export default class Circle {
  constructor(anchor, radius, color) {
    this.type = ShapeTypes.CIRCLE;
    this.radius = radius;
    this.color = color;
    this.anchor = anchor;
    this.fill = {
      type: FillTypes.COLOR,
      color,
    }
  }

  get x() {
    return this.anchor.x;
  }

  get y() {
    return this.anchor.y;
  }
}