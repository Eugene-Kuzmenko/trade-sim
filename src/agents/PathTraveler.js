import Traveler from "./Traveler";
import AgentType from "./AgentType";

/**
 * Node on the graph
 * @typedef {object} Node
 * @property {number} x - node X position
 * @property {number} y - node Y position
 */

/**
 * Edge on the graph
 * @typedef {object} Edge
 * @property {Node} start - First node
 * @property {Node} end - Second node
 */

/**
 * Agent capable to travel predetermined path
 * @property {number} x
 * @property {number} y
 * @property {Node | null} destinationNode - node to which traveler is traveling. Null if traveler is idle
 * @property {Date | null} travelStarted - time at which travel had started
 * @property {number} travelTime - time it takes to traverse the edge
 * @property {Edge[]} path - current path agent is traveling
 * @property {Number} pathIndex - index of current path step
 */
export default class PathTraveler extends Traveler {
  static type = AgentType.PATH_TRAVELER

  /**
   * Sets current path to list of edges to travel
   * @param {Edge[]} edgePath - sequence of edges to travel
   */
  travelEdgePath(edgePath) {
    if (edgePath.length < 1) return;
    this.path = edgePath
    this.pathIndex = 0;
    this.travel(this.path[this.pathIndex])
  }

  getNextPathStep() {
    if (!this.path) return null
    this.pathIndex++;
    if (this.pathIndex >= this.path.length) return null;
    return this.path[this.pathIndex];
  }

  update(dt) {
    super.update(dt);

    if (this.destinationNode == null && this.path) {
      const edge = this.getNextPathStep();
      if (edge) this.travel(edge);
    }
  }
}
