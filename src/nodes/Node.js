import { AnchoredCircle } from '../render/shapes';

/**
 * Basic node on a graph
 */
export default class Node {
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
  }

  update() {}
}

const RADIUS = 20;