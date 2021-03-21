import { BasicNode, NodeType } from './nodes';
import { EdgeType } from './edges';
import { iterShapes, IdPool, pickAtRandom } from './utils';
import Renderer from './render';
import { Traveler } from './agents';
import { StrokeTypes } from './render/enums';
import Graph from './Graph';

/**
 * Simulation engine
 */
export default class Engine {
  constructor (doc, width, height) {
    this.renderer = new Renderer(doc, width, height, ['edges', 'nodes', 'agents']);
    this.doc = doc;
    this.graph = new Graph(
      [
        { type: NodeType.BASIC, id: 0, x: 40, y: 120, color: 'blue' },
        { type: NodeType.BASIC, id: 1, x: -120, y: 120, color: 'green'},
        { type: NodeType.BASIC, id: 2, x: -20, y: -40 },
      ],
      [
        { type: EdgeType.BASIC, startId: 0, endId: 1, length: 2 },
        { type: EdgeType.BASIC, startId: 1, endId: 2 },
        { type: EdgeType.BASIC, startId: 2, endId: 0 },
      ]
    )
    this._agentIdManager = new IdPool();
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
    this._addAgent(this.graph.getNodeById(0));
    this._addAgent(this.graph.getNodeById(1));
    this._addAgent(this.graph.getNodeById(2));
  }

  /**
   * Adds agent to the graph. *Do not add nodes without it*
   * @param {BasicNode} node 
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
   * Gets node by canvas container offcenter coordinates
   * @param {number} offcenterX - x position relative to center of canvas container
   * @param {number} offcenterY - y position relative to cetner of canvas container
   * @returns {BasicNode | null}
  */
  _getNodeByOffcenterCoord(offcenterX, offcenterY) {
    const point = this._getSpacialCoord(offcenterX, offcenterY);
    return this.graph.getNodeByCoord(point.x, point.y);
  }

  /**
   * Handles editor attempting to create a node
   * @param {number} offcenterX - x position relative to center of canvas container
   * @param {number} offcenterY - y position relative to cetner of canvas container
   */
  handleEditorAddNode(offcenterX, offcenterY) {
    const point = this._getSpacialCoord(offcenterX, offcenterY);
    this.graph.addNode({
      type: NodeType.BASIC,
      ...point,
    });
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
   * @param {BasicNode} node 
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

    const startNode = this.graph.nodes.find(node => node.id === startNodeId);
    if (startNode == null) return false;

    this.graph.addEdge({
      type: EdgeType.BASIC,
      start: startNode,
      end: endNode,
    })

    this.renderEdges();

    return true;
  }

  // TODO: remove this temporary behaviour
  _travelLoop(a) {
    if (a.destinationNode == null && a.curNode.edges.length > 0) {
      a.travel(pickAtRandom(a.curNode.edges));
    }
  }

  /**
   * Calculates center point of the area, occupied by nodes;
   * @returns {Point}
   */
  _getCenterOfNodes() {
    const nodes = this.graph.nodes;
    const minX = nodes.reduce((a, b) => b.x < a.x ? b : a).x;
    const minY = nodes.reduce((a, b) => b.y < a.y ? b : a).y;
    const maxX = nodes.reduce((a, b) => b.x > a.x ? b : a).x;
    const maxY = nodes.reduce((a, b) => b.y > a.y ? b : a).y;
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
        layer.render(iterShapes(this.graph.nodes));
      },
    });
  }

  /**
   * Rerenders edge layer
   */
  renderEdges() {
    this.renderer.withViewportCentered(this.camera.x, this.camera.y, {
      edges: layer => {
        layer.render(iterShapes(this.graph.edges));
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
    for (let node of this.graph.nodes) {
      node.update();
    }
    for (let agent of this.agents) {
      agent.update();
      this._travelLoop(agent);
    }
  }
}