import CircleBase from "./CircleBase";

/**
 * Circle shape, used if you need to update it's position manually
 */
export default class Circle extends CircleBase {
  constructor(x, y, radius, color) {
    super(radius, color)
    this.x = x;
    this.y = y;
  }
}