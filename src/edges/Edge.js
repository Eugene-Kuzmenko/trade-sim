import { EdgeLine } from '../render/shapes';

/**
 * Basic edge, connecting the nodes of the graph
 */
export default class Edge {
  /**
   * @param {unique} id - unique identifier of edge
   * @param {Node} start - first node
   * @param {Node} end - second node 
   * @param {number} length - value, defining how hard to traverse the node
   */
  constructor(id, start, end, length = 1) {
    this.id = id;
    this.start = start;
    this.end = end;
    this.length = length;
    this.shape = new EdgeLine(start, end, '#354f4d', 5)
  }
}