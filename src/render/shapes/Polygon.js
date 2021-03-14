import { FillTypes, ShapeTypes, StrokeTypes } from "../enums";
/**
 * Point in 2d space
 * @typedef {object} Point
 * @property {number} x
 * @property {number} y
 */

/**
 * Shape object describing polygon
 * @property {number} angle - of the shape rotation in radians
 * @property {StrokeDescription} stroke - object describing the stroke styling
 * @property {FillDescription} stroke - object describing fill styling
 * @property {Point[]} points - list of verticies
 */ 
export default class Polygon {
  /**
   * @param {number} x - x of the center
   * @param {number} y - y of the center
   * @param {Point[]} points - list of verticies of a polygon
   * @param {CSSColor} fillColor - color to fill polygon with
   * @param {CSSColor} lineColor - color of the lines of the polygon
   * @param {number} lineWidth - width of the line
   * @param {number} angle - angle of the shape related to default
   */
  constructor(x, y, points, fillColor, lineColor = null, lineWidth = 1, angle = 0) {
    this.x = x;
    this.y = y;
    this.type = ShapeTypes.POLYGON
    if (fillColor) {
      this.fill = {
        type: FillTypes.COLOR,
        color: fillColor,
      }
    }
    if (lineColor) {
      this.stroke = {
        type: StrokeTypes.COLOR,
        color: lineColor,
        width: lineWidth,
      }
    }
    this.points = points;
    this.angle = angle;
  }
}