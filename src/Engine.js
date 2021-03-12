import { CircleNode } from './nodes';
import { Edge } from './edges';
import Renderer from './render';

export default class Engine {
  constructor (doc, width, height) {
    this.renderer = new Renderer(doc, width, height, ['edges', 'nodes', 'agents']);
    this.doc = doc;
    this.nodes = [
      new CircleNode(40, 120),
      new CircleNode(-120, 120),
      new CircleNode(-20, -40)
    ];
    this.edges =[
      new Edge(this.nodes[0], this.nodes[1]),
      new Edge(this.nodes[0], this.nodes[2]),
      new Edge(this.nodes[1], this.nodes[2]),
    ];
    this.camera = {x: 0, y: 0};
    this._centerCameraOnNodes();
  }

  attachToElement(element) {
    this.renderer.attachToElement(element);
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

  * _iterNodeShapes() {
    for (let node of this.nodes) {
      yield node.shape;
    }
  }

  * _iterEdgeShapes() {
    for (let edge of this.edges) {
      yield edge.shape;
    }
  }

  render() {
    this.renderer.withViewportCentered(this.camera.x, this.camera.y, {
      nodes: layer => {
        layer.render(this._iterNodeShapes());
      },
      edges: layer => {
        layer.render(this._iterEdgeShapes());
      }
    });
  }

  update() {
    for (let node of this.nodes) {
      node.update()
    }
  }
}