import { ArrowSpaceShip } from "../render/shapes";
import { getVectorAngle } from '../utils';
import AgentType from './AgentType';

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
 * @property {number} x
 * @property {number} y
 * @property {Node | null} destinationNode - node to which traveler is traveling. Null if traveler is idle
 * @property {Date | null} travelStarted - time at which travel had started
 * @property {number} travelTime - time it takes to traverse the edge
 * @property {number} progress - how much of the edge have been traversed
 */
export default class Traveler {
  static type = AgentType.TRAVELER;
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
    this._travelTime = travelTime;
    this._shape = new ArrowSpaceShip(curNode.x, curNode.y, 10, '#00b368', '#00ff94', 1);
  }

  get type() {
    return this.constructor.type;
  }

  get travelTime() {
    return this._travelTime * this.curEdge?.length ?? 1;
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
   * Starts travel between nodes
   * @param {Edge} edge - Valid edge, by which travel will proceed. Should be attached to current node of the traveler
   */
  travel(edge) {
    let canTravel = this.destinationNode !== null;
    if (edge.start === this.curNode) this.destinationNode = edge.end;
    else if (edge.end === this.curNode) this.destinationNode = edge.start;
    else canTravel = false;
    if (!canTravel) {
        console.warn('cannot start travel');
    }
    this.travelStarted = new Date();
    this.curEdge = edge;
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
        this.curEdge = null;
    }
  }


  /**
   * Creates agent based on plain initializer object
   * @param {TravelerDump} agentData - contains data required for agent creation 
   * @param {NodeResolver} resolver - object, that allows retrieve nodes by Id
   * @returns {Traveler}
   */
  static create(agentData, resolver) {
    const { id, nodeId, travelTime } = agentData;
    return new Traveler(id, resolver.getNodeById(nodeId), travelTime);
  }

  /**
   * Creates plain initialiser object, that can be used to initialise that kind of agent
   * @returns {TravelerDump}
   */
  getDump() {
    return {
      type: this.type,
      id: this.id,
      nodeId: this.curNode.id,
      travelTime: this.travel.type,
    };
  }
}

/**
 * Initialiser object for traveler
 * @typedef {
 *   type: string,
 *   id: unique,
 *   curNodeId: unique,
 *   travelTime: number
 * } TravelerDump
 */

/**
 * Object, that allows to get node by Id
 * @typedef {object} NodeResolver
 * @property {GetNodeById} getNodeById - returns node
 */


 /**
 * Gets node by id
 * @callback GetNodeById
 * @param {unique} nodeId - Id of a node you want to find
 * @returns {Node}
 */