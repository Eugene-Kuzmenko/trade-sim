import { ShapeTypes, FillTypes, StrokeTypes } from './enums';

/**
 * Callback which allows perform actions with specific layer
 * @callback RenderingTask
 * @param {Layer} 
 */

/**
 * Rendering abstraction for rendering specic layer
 */
export default class Layer {
  _shapeDrawers = {
    /**
     * Draws Circle
     * @param {Context} context 
     * @param {CircleShape} shape 
     */
    [ShapeTypes.CIRCLE]: (context, shape) => {
      context.beginPath();
      context.ellipse(shape.x, shape.y, shape.radius, shape.radius, 0, 0, Math.PI * 2);
      fill(context, shape.fill);
      stroke(context, shape.stroke);
    },
    [ShapeTypes.LINE]: (context, shape) => {

      if (shape.stroke.width) {
        context.lineWidth = shape.stroke.width;
      }

      context.beginPath();
      context.moveTo(shape.start.x, shape.start.y);
      context.lineTo(shape.end.x, shape.end.y);
      stroke(context, shape.stroke);
    },
    [ShapeTypes.POLYGON]: (context, shape) => {
      context.save();
      context.translate(shape.x, shape.y);
      context.rotate(shape.angle);
      context.beginPath();
      if (shape.points == null || shape.points.length <= 0) {
        throw Error('No vertices provided to draw polygon');
      };
      context.moveTo(shape.points[0].x, shape.points[0].y);
      for(let i = 1; i < shape.points.length; i++) {
        context.lineTo(shape.points[i].x, shape.points[i].y);
      };
      context.closePath();

      fill(context, shape.fill);
      stroke(context, shape.stroke);
      context.restore()
    }
  };

  /**
   * 
   * @param {HTMLDocument} doc - DOM document
   * @param {string} name - Layer name (key)
   * @param {number} width - Layer width in pixels
   * @param {number} height - Layer height in pixels
   */
  constructor(doc, name, width, height) {
    this.name = name;
    this.canvas = doc.createElement('canvas');
    this.canvas.height = height;
    this.canvas.width = width;
    this.drawingContext = this.canvas.getContext('2d');
  }

  clear() {
    this.drawingContext.clearRect(
      0, 0, this.canvas.width, this.canvas.height,
    );
  }

  /**
   * Translates context to perform rendering task and then translates back
   * @param {number} x - shift x
   * @param {number} y - shift y
   * @param {RenderingTask} renderingTask 
   */
  renderTranslated(x, y, shapes) {
    this.clear();
    this.drawingContext.save();
    this.drawingContext.translate(x, y);
    this.render(shapes);
    this.drawingContext.restore();
  }

  /**
   * Renders array of shapes described
   * @param {Shape[]} shapes 
   */
  render(shapes) {
    for (let shape of shapes) {
      const shapeDrawer = this._shapeDrawers[shape.type];
      if (shapeDrawer) {
        this.drawingContext.save();
        shapeDrawer(this.drawingContext, shape);
        this.drawingContext.restore();
      }
    }
  }
}


/**
 * Function that makes context draw lines of the shape
 * @param {Context} context 
 * @param {object} stroke 
 */
function stroke(context, stroke) {
  if (!stroke) return;
  if (stroke.type === StrokeTypes.COLOR) {
    context.strokeStyle = stroke.color
  }
  context.stroke()
}

/**
 * Function that makes context fill the shape
 * @param {Context} context 
 * @param {object} stroke 
 */
function fill(context, fill) {
  if (!fill) return;
  if (fill.type === FillTypes.COLOR) {
    context.fillStyle = fill.color;
  }

  context.fill()
}