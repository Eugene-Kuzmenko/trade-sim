import Polygon from "./Polygon";

/**
 * Arrow shape polygon
 */
export default class ArrowSpaceShip extends Polygon {
  /**
   * 
   * @param {number} x - center x position
   * @param {number} y - center y position
   * @param {number} size - size of the polygon 
   * @param {CSSColor} color - color of the polygon
   * @param {CSSColor} lineColor - colors of the edges of the polygon
   * @param {number} - width of the edges
   */
  constructor(x, y, size, color, lineColor, lineWidth) {
    const wingspan = Math.round(size * 5/7);
    const butt = -wingspan;
    const points = [
      {y: 0, x: butt},
      {y: wingspan, x: -size},
      {y: 0, x: size},
      {y: -wingspan, x: -size},
      {y: 0, x: butt},
    ];
    super(x, y, points, color, lineColor, lineWidth);
  }
}