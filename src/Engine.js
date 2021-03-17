import { Node } from './nodes';
import { iterShapes, IdPool } from './utils';
import { Edge } from './edges';
import Renderer from './render';
import { Traveler } from './agents';
import { StrokeTypes } from './render/enums';

/**
 * Simulation engine
 */
export default class Engine {
  constructor (doc, width, height) {
    this.renderer = new Renderer(doc, width, height, ['edges', 'nodes', 'agents']);
    this.doc = doc;
    this._nodeIdManager = new IdPool();
    this._edgeIdManager = new IdPool();
    this._agentIdManager = new IdPool();
    this.nodes = [];
    this.edges = [];
    this.agents = [];
    this._initDemoGraph();
    this.camera = {x: 0, y: 0};
    this._centerCameraOnNodes();
  }

  /**
   * ToDo: Replace with json fixture
   * Creates graph for demonstration and testing purposes
   */
  _initDemoGraph() {
    this._addNode(40, 120, 'blue');
    this._addNode(-120, 120, 'green');
    this._addNode(-20, -40);
    this._addEdge(this.nodes[0], this.nodes[1], 2);
    this._addEdge(this.nodes[0], this.nodes[2]);
    this._addEdge(this.nodes[1], this.nodes[2]);
    this._addAgent(this.nodes[0]);
    this._addAgent(this.nodes[1], 0.7);
    this._addAgent(this.nodes[2]);
  }
  
  /**
   * Adds node to a graph. *Do not add nodes without it*
   * @param {number} x 
   * @param {number} y 
   * @param {CSSColor} color 

   */
  _addNode(x, y, color) {

    this.nodes.push(
      new Node(
        this._nodeIdManager.getId(),
        x, y, color
      )
    );
  }
  
  /**
   * Connects nodes with an edge. *Do not add nodes without it*
   * @param {Node} start 
   * @param {Node} end 
   * @param {number} length  
   */
  _addEdge(start, end, length) {
    
    this.edges.push(
      new Edge(
        this._edgeIdManager.getId(), start, end, length
      )
    );
  }

  /**
   * Adds agent to the graph. *Do not add nodes without it*
   * @param {Node} node 
   * @param {number} travelTime - relative time it takes to traverse a unit of edge length
   */
  _addAgent(node, travelTime){
    const id = this._agentIdManager.getId();
    this.agents.push(new Traveler(id, node, travelTime));
  }

  /**
   * Attaches rendering canvases to html element
   * @param {HTMLElement} element 
   */
  attachToElement(element) {
    this.renderer.attachToElement(element);
  }

  /**
   * Gets coordinates in graph space that corresponse to coordinate in container element
   * @param {number} offcenterX - x relative to renderer container's center
   * @param {number} offcenterY - y relative to renderer container's center
   * @returns {Point}
   */
  _getSpacialCoord(offcenterX, offcenterY) {
    return {
      x: offcenterX + this.camera.x,
      y: offcenterY + this.camera.y,
    }
  }

  /**
   * Gets node that includes coordinates
   * @param {number} x - x of the point in graph space
   * @param {number} y - y of the point in graph space
   * @returns {Node | null}
   */
  _getNodeByCoord(x, y) {
    for (let node of this.nodes) {
      // do rough selection by square bounding box
      const dx = node.shape.x - x;
      const dy = node.shape.y - y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) > node.shape.radius) continue;

      // do precise selection using distance between the points
      const distance = Math.sqrt(dx^2 + dy^2);
      if (distance > node.shape.radius) continue;

      return node;
    }
    return null;
  }

  /**
   * Gets node by canvas container offcenter coordinates
   * @param {number} offcenterX - x position relative to center of canvas container
   * @param {number} offcenterY - y position relative to cetner of canvas container
   * @returns {Node | null}
  */
  _getNodeByOffcenterCoord(offcenterX, offcenterY) {
    const point = this._getSpacialCoord(offcenterX, offcenterY);
    return this._getNodeByCoord(point.x, point.y);
  }

  /**
   * Handles editor attempting to create a node
   * @param {number} offcenterX - x position relative to center of canvas container
   * @param {number} offcenterY - y position relative to cetner of canvas container
   */
  handleEditorAddNode(offcenterX, offcenterY) {
    const point = this._getSpacialCoord(offcenterX, offcenterY);
    this._addNode(point.x, point.y);
    this.renderNodes();
  }

  /**
   * Handles editor selecting node
   * @param {number} offcenterX - x position relative to center of canvas container
   * @param {number} offcenterY - y position relative to center of canvas container
   */
  handleEditorSelectNode(offcenterX, offcenterY) {
    const node = this._getNodeByOffcenterCoord(offcenterX, offcenterY);
    return node?.id;
  }

  /**
   * Highlights node
   * @param {Node} node 
   * @param {CSSColor} color 
   */
  _highlightNode(node, color='white') {
    node.shape.stroke = {
      type: StrokeTypes.COLOR,
      color,
    }
    this.renderNodes();
  }
  

  /**
   * Handles editor attempting create an edge
   * @param {unique} selectedNodeId - Previously selected node
   * @param {number} offcenterX - x position relative to center of canvas container
   * @param {number} offcenterY - y position relative to center of canvas container
   * @returns 
   */
  handleEditorAddEdge(startNodeId, offcenterX, offcenterY) {
    const endNode = this._getNodeByOffcenterCoord(offcenterX, offcenterY);
    // Signifies to Editor that attempt failed
    if (endNode == null) return false;

    const startNode = this.nodes.find(node => node.id === startNodeId);
    if (startNode == null) return false;

    this._addEdge(startNode, endNode);
    this.renderEdges();

    return true;
  }

  // TODO: remove this temporary behaviour
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

  /**
   * Calculates center point of the area, occupied by nodes;
   * @returns {Point}
   */
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

  /**
   * Puts viewport center in the middle of the area, that occupied by nodes
   */
  _centerCameraOnNodes() {
    this.camera = this._getCenterOfNodes()
  }

  /**
   * Rerenders all layers
   */
  renderAll() {
    this.renderNodes()
    this.renderEdges()
    this.renderAgents()
  }

  /**
   * Rerenders node layer
   */
  renderNodes() {
    this.renderer.withViewportCentered(this.camera.x, this.camera.y, {
      nodes: layer => {
        layer.render(iterShapes(this.nodes));
      },
    });
  }

  /**
   * Rerenders edge layer
   */
  renderEdges() {
    this.renderer.withViewportCentered(this.camera.x, this.camera.y, {
      edges: layer => {
        layer.render(iterShapes(this.edges));
      },
    });
  }
  /**
   * Rerenders agent layer
   */
  renderAgents() {
    this.renderer.withViewportCentered(this.camera.x, this.camera.y, {
      agents: layer => {
        layer.render(iterShapes(this.agents));
      }
    });
  }

  /**
   * Method that updates state of the objects in the simulation
   */
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