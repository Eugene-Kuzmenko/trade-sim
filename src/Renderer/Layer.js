import { ShapeTypes, FillTypes } from '../enums';

export default class Layer {
  _shapeDrawers = {
    [ShapeTypes.CIRCLE]: (context, shape) => {
      context.beginPath();
      context.ellipse(shape.x, shape.y, shape.radius, shape.radius, 0, 0, Math.PI * 2);
      if (shape.fill) {
        if (shape.fill.type === FillTypes.COLOR) {
          context.fillStyle = shape.fill.color;
        }

        context.fill()
      }
    }
  };

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

  withTranslate(x, y, renderingTask) {
    this.drawingContext.save();
    this.drawingContext.translate(x, y);
    renderingTask(this);
    this.drawingContext.restore();
  }

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



  drawCircle(x, y, radius, fillStyle) {
    this.drawingContext.save();
    this.drawingContext.fillStyle = fillStyle;
    this.drawingContext.beginPath();
    this.drawingContext.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
    this.drawingContext.fill();
    this.drawingContext.restore();
  }
}