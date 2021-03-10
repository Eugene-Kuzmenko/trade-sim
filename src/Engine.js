import { CircleNode } from './nodes';

export default class Engine {
  constructor (doc) {
    this.canvas = doc.getElementById('main_canvas');
    this.drawingContext = this.canvas.getContext('2d');
    this.doc = doc;
    this.nodes = [
      new CircleNode(40, 40),
      new CircleNode(120, 120),
      new CircleNode(-20, -40)
    ];
    this.camera = {x: 0, y: 0};
    this._centerCameraOnNodes();
  }

  syncCanvasToWindowSize() {
    const { clientHeight, clientWidth } = this.doc.body;
    this.canvas.width = clientWidth;
    this.canvas.height = clientHeight;
  }

  _getCenterOfNodes() {
    const minX = this.nodes.reduce((a, b) => b.x < a.x ? b : a).x;
    const minY = this.nodes.reduce((a, b) => b.y < a.y ? b : a).y;
    const maxX = this.nodes.reduce((a, b) => b.x > a.x ? b : a).x;
    const maxY = this.nodes.reduce((a, b) => b.y > a.y ? b : a).y;
    return {
      x: minX + (maxX - minX) / 2,
      y: minY + (maxY - minY) / 2
    }
  }

  _centerCameraOnNodes() {
    this.camera = this._getCenterOfNodes()
  }

  render() {
    this.drawingContext.save();
    const halfViewWidth = this.canvas.width * 0.5;
    const halfViewHeight = this.canvas.height * 0.5;
    console.log(this.camera);
    this.drawingContext.fillStyle = 'black';
    this.drawingContext.fillRect(
      0, 0, this.canvas.width, this.canvas.height,
    );
    this.drawingContext.translate(
       halfViewWidth - this.camera.x,
       halfViewHeight - this.camera.y,
    );

    for (let node of this.nodes) {
      node.render(this.drawingContext);
    }
    this.drawingContext.restore();
  }

  update() {
    for (let node of this.nodes) {
      node.update()
    }
  }
}