import { Edge } from '.';
import { EdgeLine } from '../render/shapes';
import EdgeType from "./EdgeType";

/**
 * Basic edge, connecting the nodes of the graph
 */
export default class BasicEdge {
  static type = EdgeType.BASIC

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
    this.shape = new EdgeLine(start, end, '#354f4d', 5 * length)
  }

  /**
   * Creates an edge based on an object
   * @param {BasicEdgeDump} dump - plain object that describes edge
   * @param {Resolver} resolver - object, that allows you to get actual nodes
   * @returns 
   */
  static create(dump, resolver) {
    const start = dump.start || resolver.getNodeById(dump.startId);
    const end = dump.end || resolver.getNodeById(dump.endId);
    if (!(start && end)) return null;
    return new Edge(
      dump.id,
      start,
      end,
      dump.length,
    );
  }

  dump() {
    return {
      id: this.id,
      startId: this.start.id,
      endId: this.end.id,
      length: this.length,
    }
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
 * Plain object, that has enough info to create an edge
 * @typedef {object} BasicEdgeDump
 * @property {unique} id - id of this edge
 * @property {unique} startId - id of the first node
 * @property {unique} endId - id of the second node
 * @property {number = 1} length - defines how long it takes to traverse the node
 */