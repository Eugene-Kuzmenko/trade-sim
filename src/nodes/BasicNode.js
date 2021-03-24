import { AnchoredCircle } from '../render/shapes';
import NodeType from './NodeType';

/**
 * Basic node on a graph
 */
export default class BasicNode {
  static type = NodeType.BASIC;
  /**
   * 
   * @param {unique} id - unique identifier of the node 
   * @param {number} x - x position of the node in space 
   * @param {number} y - y position of the node in space
   * @param {CSSColor} color - color of the node
   */
  constructor(id, x, y, color='rgb(255, 252, 56)') {
    this.id = id;
    this.x = x;
    this.y = y;
    this.shape = new AnchoredCircle(this, RADIUS, color);
    this.edges = [];
  }

  get type() {
    return this.constructor.type;
  }

  /**
   * Creates node based on dump object
   * @param {BasicNodeDump} dump - simple object, that contains just enough data to create a node
   * @returns {BasicNode}
   */
  static create(dump) {
    return new BasicNode(
      dump.id,
      dump.x,
      dump.y,
      dump.color,
    );
  }
  
  /**
   * Creates plain object, that can be used to recreate it with create and rehydrate method
   * @returns {BasicNodeDump}
   */
  getDump() {
    return {
      id: this.id,
      type: this.type,
      x: this.x,
      y: this.y,
      color: this.shape.fill.color,
    }
  }

  /**
   * Adds edge, connected to this node
   */
  addEdge(edge) {
    this.edges.push(edge);
  }

  /**
   * Removes edge that has specified id, if it's connected to this node
   * @param {unique} edgeToRemoveId - id of the edge you want to remove
   */
  removeEdge(edgeToRemoveId) {
    const index = this.edges.findIndex(edge => edge.id === edgeToRemoveId);
    if (index > 0) { // if found
      this.edges.splice(index, 1);
    }
  }

  update() {}
}

const RADIUS = 20;

/**
 * Object, that contains enought data to initialize basic Node
 * @typedef {object} BasicNodeDump
 * @property {string} type - Type of the node
 * @property {unique} id - Node's identifier
 * @property {number} x - X position of the node in 2D space
 * @property {number} y - Y position of the node in 2D space
 * @property {CSSColor} color - color of the node
 */