import { EdgeTypeMap } from './edges';
import { NodeTypeMap } from './nodes';
import { AgentTypeMap } from './agents';
import { IdPool } from './utils';


/**
 * Object responsible for managing graph
 */
export default class Graph {
  constructor(nodes, edges, agents) {
    this._idManagers = {
      node: new IdPool(),
      edge: new IdPool(),
      agent: new IdPool(),
    }
    this._nodes = []
    this._edges = []
    this._agents = []

    const nodeMap = {};
    for (let node of nodes) {
      nodeMap[node.id] = this.addNode(node);
    }

    const hashedNodeResolver = {
      getNodeById: id => nodeMap[id],
    };

    for (let edge of edges) {
      this.addEdge(edge, hashedNodeResolver);
    }

    for (let agent of agents) {
      this.addAgent(agent, hashedNodeResolver);
    }

    this._resolver = { getNodeById: this.getNodeById };
  }

  /**
   * Creates graph object from the plain graph representation
   * @param {GraphDump} plainGraph 
   * @returns {Graph}
   */
  static create(plainGraph) {
    return new Graph(plainGraph.nodes, plainGraph.edges, plainGraph.agents);
  }

  
  get nodes() {
    return this._nodes;
  }

  get edges() {
    return this._edges;
  }

  get agents() {
    return this._agents;
  }

  static _typeMaps = {
    'node': NodeTypeMap,
    'edge': EdgeTypeMap,
    'agent': AgentTypeMap,
  }

  /**
   * Creates instance of object type
   * @param {string} type - Overall type of object
   * @param {object} dump - plain object used to create class instance
   * @param {Resolver} resolver - object that allows to get related objects by key
   */
  _create(type, dump, resolver = null) {
    if (resolver === null) resolver = this._resolver;
    const Class = this.constructor._typeMaps[type][dump.type];
    if (!Class) throw new Error(`${superType} type "${dump.type}" is not recognized`);
    return Class.create(
      { ...dump, id: this._idManagers[type].getId(dump.id) },
      resolver
    );
  }

  /**
   * Adds node to a graph
   * @param {object} plainNode - Plain representation of a node
   */
  addNode(plainNode) {
    const node = this._create('node', plainNode)
    this.nodes.push(node);
    return node;
  }

  /**
   * Adds edge to the graph
   * @param {object} plainEdge - Plain object representation of an edge
   * @param {Resolver} resolver - Object, that provides Edge with relevant data
   */
  addEdge(plainEdge, resolver=null) {
    const edge = this._create('edge', plainEdge, resolver);
    this.edges.push(edge)

    edge.start.addEdge(edge);
    edge.end.addEdge(edge);
    return edge;
  }

  /**
   * Adds agent to a graph
   * @param {object} plainAgent - Plain object representation of an agent
   * @param {Resolver} resolver - Object, that provides Agent with relevant data
   */
  addAgent(plainAgent, resolver=null) {
    const agent = this._create('agent', plainAgent, resolver);
    this.agents.push(agent);
    return agent;
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
   * Returns Agent that matches specified id
   * @method
   * @param {number} id - id of the node
   * @returns {Agent}
   */
  getAgentById = id => this._agents.find(agent => agent.id === id);

  /**
   * Returns plain object representation of the graph
   * @returns {GraphDump}
   */
  getDump() {
    const dump = { nodes: [], edges: [], agents: [] };
    for (let node of this.nodes) dump.nodes.push(node.getDump());
    for (let edge of this.edges) dump.edges.push(edge.getDump());
    for (let agent of this.agents) dump.agents.push(agent.getDump());
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