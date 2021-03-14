import CircleBase from './CircleBase';

/**
 * Anchor point of the circle, which defines it's center
 * @typedef {object} Anchor
 * @property {number} x
 * @property {number} y
 */

/**
 * Circle shape that derrives it's position from achor component
 */
export default class AnchoredCircle extends CircleBase {
  constructor(anchor, radius, color) {
    super(radius, color);
    this.anchor = anchor;
  }

  get x() {
    return this.anchor.x;
  }

  get y() {
    return this.anchor.y;
  }
}