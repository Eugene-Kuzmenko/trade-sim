import { ShapeTypes, FillTypes } from '../enums';
import { EditorFieldType } from '../../editorFields';

/**
 * Base class of the circle shape
 */
export default class CircleBase {
  constructor(radius, color) {
    this.type = ShapeTypes.CIRCLE;
    this.radius = radius;
    this.color = color;
    this.fill = {
      type: FillTypes.COLOR,
      color,
    };
  }

  get editorFields() {
    return [
      {
        type: EditorFieldType.NUMBER,
        t
      }
    ]
  }
}