import { ShapeTypes, StrokeTypes } from '../enums';

export default class EdgeLine {
  type = ShapeTypes.LINE;

  constructor (startNode, endNode, color, width) {
    this.start = startNode;
    this.end = endNode;
    this.stroke = {
      type: StrokeTypes.COLOR,
      color,
      width,
    };
  }
}