import { NodeType } from './nodes';
import { EdgeType } from './edges';
import { iterShapes } from './utils';
import Renderer from './render';
import { StrokeTypes } from './render/enums';
import Graph from './Graph';
import { AgentType } from './agents';
import { breathFirstSearch } from "./path_finding";
import PathTraveler from "./agents/PathTraveler";

/**
 * Simulation engine
 */
export default class Engine {
  constructor (doc, graph, width, height) {
    this.renderer = new Renderer(doc, width, height, ['edges', 'nodes', 'agents']);
    this.doc = doc;
    this.graph = Graph.create(graph);
    const sendAgentTo = (agentId, nodeId) => {
      const agent = this.graph.getAgentById(agentId);
      agent.travelEdgePath(breathFirstSearch(agent.curNode, nodeId))
    }

    sendAgentTo(0, 6);
    sendAgentTo(1, 16);
    sendAgentTo(2, 5);

    this.camera = {x: 0, y: 0};
    this._centerCameraOnNodes();
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
   * Handles editor attempting to create a agent
   * @param {unique} nodeId - Node id where agent supposed to be added
   */
  handleEditorAddAgent(nodeId) {
    this.graph.addAgent({
      type: AgentType.TRAVELER,
      nodeId,
    });
    this.renderAgents();
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

  handleEditorSetAgentPath(nodeId, offcenterX, offcenterY) {
    if (nodeId == null) return;
    let foundAgent;
    for (let agent of this.graph.agents) {
      if (!agent.isTraveling && agent.curNode.id === nodeId) {
        foundAgent = agent;
        break;
      }
    }
    if (foundAgent instanceof PathTraveler) {
      const endNode = this._getNodeByOffcenterCoord(offcenterX, offcenterY)
      foundAgent.travelEdgePath(breathFirstSearch(foundAgent.curNode, endNode.id));
    }
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
   * Handles editor importing a graph
   * @param {PlainGraph} graph 
   */
  handleEditorLoadGraph(graph) {
    this.graph = Graph.create(graph);
    this.renderAll();
  }

  /**
   * Handles editor importing a graph
   * @param {PlainGraph} graph 
   */
  handleEditorSaveGraph() {
    return this.graph.getDump();
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
    this.renderer.renderWithCamera(this.camera.x, this.camera.y, {
      nodes: iterShapes(this.graph.nodes)
    });
  }

  /**
   * Rerenders edge layer
   */
  renderEdges() {
    this.renderer.renderWithCamera(this.camera.x, this.camera.y, {
      edges: iterShapes(this.graph.edges)
    });
  }
  /**
   * Rerenders agent layer
   */
  renderAgents() {
    this.renderer.renderWithCamera(this.camera.x, this.camera.y, {
      agents: iterShapes(this.graph.agents)
    });
  }

  /**
   * Method that updates state of the objects in the simulation
   */
  update() {
    for (let node of this.graph.nodes) {
      node.update();
    }
    for (let agent of this.graph.agents) {
      agent.update();
    }
  }
}