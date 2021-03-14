import { CircleNode } from './nodes';
import { Edge } from './edges';
import Renderer from './render';
import { Traveler } from './agents';

export default class Engine {
  constructor (doc, width, height) {
    this.renderer = new Renderer(doc, width, height, ['edges', 'nodes', 'agents']);
    this.doc = doc;
    this.nodes = [
      new CircleNode(40, 120, 'blue'),
      new CircleNode(-120, 120, 'green'),
      new CircleNode(-20, -40)
    ];
    this.edges =[
      new Edge(this.nodes[0], this.nodes[1]),
      new Edge(this.nodes[0], this.nodes[2]),
      new Edge(this.nodes[1], this.nodes[2]),
    ];
    this.agents = [
      new Traveler(this.nodes[0]),
      new Traveler(this.nodes[1]),
      new Traveler(this.nodes[2]),
    ]
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

  _travelLoop(a) {
    if (a.destinationNode == null) {
      switch (a.curNode) {
        case this.nodes[0]:
          a.travel(this.edges[0]);
          break;
        case this.nodes[1]:
          a.travel(this.edges[2]);
          break;
        case this.nodes[2]:
          a.travel(this.edges[1]);
          break;
        default:
          break
      }
    }
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

  * _iterAgentShapes() {
  for (let agent of this.agents) {
    yield agent.shape;
  }
}

  render() {
    this.renderer.withViewportCentered(this.camera.x, this.camera.y, {
      nodes: layer => {
        layer.render(this._iterNodeShapes());
      },
      edges: layer => {
        layer.render(this._iterEdgeShapes());
      },
      agents: layer => {
        layer.render(this._iterAgentShapes());
      }
    });
  }

  renderAgents() {
    this.renderer.withViewportCentered(this.camera.x, this.camera.y, {
      agents: layer => {
        layer.render(this._iterAgentShapes());
      }
    });
  }

  update() {
    for (let node of this.nodes) {
      node.update();
    }
    for (let agent of this.agents) {
      agent.update();
      this._travelLoop(agent);
    }
  }
}