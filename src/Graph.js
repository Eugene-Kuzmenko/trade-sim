import { EdgeTypeMap } from './edges';
import { NodeTypeMap } from './nodes';
import { IdPool } from './utils';

/**
 * Object responsible for managing graph
 */
export default class Graph {
  constructor(nodes, edges) {
    this._nodeIdManager = new IdPool();
    this._edgeIdManager = new IdPool();
    this._nodes = []
    this._edges = []

    const nodeMap = {};
    for (let node of nodes) {
      nodeMap[node.id] = this.addNode(node);
    }

    for (let edge of edges) {
      this.addEdge(edge, {
        getNodeById: id => nodeMap[id],
      });
    }

    this._resolver = { getNodeById: this.getNodeById }
  }

  /**
   * Creates graph object from the plain graph representation
   * @param {GraphDump} plainGraph 
   * @returns {Graph}
   */
  static create(plainGraph) {
    return new Graph(plainGraph.nodes, plainGraph.edges);
  }

  get nodes() {
    return this._nodes;
  }

  get edges() {
    return this._edges;
  }

  /**
   * Adds node to a graph
   * @param {object} plainNode - Plain representation of a node
   */
  addNode(plainNode) {
    const Node = NodeTypeMap[plainNode.type];
    if (!Node) throw new Error(`Node type "${plainNode.type}" is not recognized`);
    const node = Node.create({
      ...plainNode,
      id: this._nodeIdManager.getId(plainNode.id), // creates new id if current doesnt exist
    });
    this.nodes.push(node);
    return node;
  }

  /**
   * Adds edge to the graph
   * @param {object} plainEdge - Plain object representation of an edge
   * @param {Resolver} resolver - Object, that provides Edge with relevant data
   */
  addEdge(plainEdge, resolver=null) {
    const Edge = EdgeTypeMap[plainEdge.type];
    if (!Edge) throw new Error(`Edge type "${plainEdge.type}" is not recognized`);
    if (resolver === null) resolver = this._resolver;
  
    const edge = Edge.create(
      {
        ...plainEdge,
        id: this._edgeIdManager.getId(plainEdge.id), // creates new id if current doesnt exist
      }, 
      resolver
    );
    this.edges.push(edge)

    edge.start.addEdge(edge);
    edge.end.addEdge(edge);
    return edge;
  }

  /**
   * Gets node that includes coordinates
   * @param {number} x - x of the point in graph space
   * @param {number} y - y of the point in graph space
   * @returns {BasicNode | null}
   */
   getNodeByCoord(x, y) {
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
   * Returns Node that matches id
   * @method
   * @param {number} id - id of the node
   * @returns {Node}
   */
  getNodeById = id => this._nodes.find(node => node.id === id);
    /**
   * Returns Edge that matches specified id
   * @method
   * @param {number} id - id of the node
   * @returns {Node}
   */
  getEdgeById = id => this._edges.find(edge => edge.id === id);

  /**
   * Returns plain object representation of the graph
   * @returns {GraphDump}
   */
  getDump() {
    const dump = { nodes: [], edges: [] };
    for (let node of this.nodes) dump.nodes.push(node.getDump());
    for (let edge of this.edges) dump.edges.push(edge.getDump());
    return dump;
  }
}

/**
 * Object, that provides Edge with relevant data
 * @typedef {object} Resolver
 * Finds node that match the id
 * @property {GetNodeById} getNodeById

 */

/**
 * Gets node by id
 * @callback GetNodeById
 * @param {unique} nodeId - Id of a node you want to find
 * @returns {Node}
 */

/**
 * Plain object, representing the graph
 * @typedef ({
 *   nodes: Node[],
 *   edges: Edge[],
 * }) GraphDump
 */