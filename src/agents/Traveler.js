import { Polygon } from "../render/shapes";
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
 * Spaceship traveling between nodes
 * @property x {number}
 * @property y {number}
 * @property destinationNode {Node | null} - node to which traveler is traveling. Null if traveler is idle
 * @property travelStarted {Date | null} - time at which travel had started
 * @property travelTime {number} - time it takes to traverse the edge
 * @property progress {number} - how much of the edge have been traversed
 */
export default class Traveler {
  curEdge = null;
  travelStarted = null;
  destinationNode = null;
  
  /**
   * @param {unique} id - Unique identifier of the agent 
   * @param {Node} curNode - Node at which traveler starts
   * @param {number} travelTime - Time it takes traveler to get from node to node (in seconds)
   */
  constructor(id, curNode, travelTime = 2) {
    this.id = id;
    this.curNode = curNode;
    this.travelTime = travelTime;
    const points = [
      {y: 0, x: 5},
      {y: 5, x: 7},
      {y: 0, x: -7},
      {y: -5, x: 7},
      {y: 0, x: 5},
    ]
    this._shape = new Polygon(curNode.x, curNode.y, points, 'red');
  }

  /**
   * Returns updated shape of the object
   */
  get shape() {
    if (this.destinationNode !== null && this.travelStarted) {
      const progress = this.progress
      if (progress >= 1) {
        this._shape.x = this.destinationNode.x;
        this._shape.y = this.destinationNode.y;
        this._shape.angle = 0;
      } else {
        const getCoordFromProgress = (start, end) => start + (end - start) * progress;
        this._shape.x = getCoordFromProgress(this.curNode.x, this.destinationNode.x);
        this._shape.y = getCoordFromProgress(this.curNode.y, this.destinationNode.y);
        this._shape.angle = this._travelAngle;
      }
    }
    else {
      this._shape.x = this.curNode.x;
      this._shape.y = this.curNode.y;
      this._shape.angle = 0;
    }
    return this._shape;
  }
  /**
   * Returns current progress compared to the start
   */
  get progress() {
    this._progress = (new Date() - this.travelStarted) / (this.travelTime * 1000);
    return this._progress;
  }

  /**
   * Initiate travel between nodes
   * @param {Edge} edge - Valid edge, by which travel will proceed. Should be attached to current node of the traveler
   */
  travel(edge) {
    if (edge.start === this.curNode) this.destinationNode = edge.end;
    if (edge.end === this.curNode) this.destinationNode = edge.start;
    if (this.destinationNode === null) {
        console.warn('cannot start travel')
    }
    this.travelStarted = new Date();
    this._travelAngle = getVectorAngle(this.curNode, this.destinationNode);
  }

  /**
   * Update object's state
   * @param {number} dt - Time passed between update
   */
  update(dt) {
    // Checking if we arrived
    if (this.progress >= 1 && this.destinationNode !== null) {
        this.curNode = this.destinationNode;
        this.destinationNode = null;
    }  
  }
}


/**
 * Calculates angle of the vector between origin point and destination point
 * @param {Point} a - origin point
 * @param {Point} b - destination point
 * @returns {number}
 */
function getVectorAngle(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const tan = dy / dx;
  let angle = dx === 0 ?  Math.PI * 0.5 : Math.atan(tan);
  if (dy > 0) return Math.PI + angle;
  if (dx > 0) return Math.PI + angle;
  return angle;
}
