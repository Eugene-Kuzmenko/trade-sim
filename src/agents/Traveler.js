import Circle from "../render/shapes/Circle";
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
     * 
     * @param {Node} curNode - Node at which traveler starts
     * @param {number} travelTime - Time it takes traveler to get from node to node (in seconds)
     */
    constructor(curNode, travelTime = 2) {
        this.curNode = curNode;
        this.travelTime = travelTime;
        this._shape = new Circle(curNode.x, curNode.y, 5, 'red');
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
            } else {
                const getCoordFromProgress = (start, end) => start + (end - start) * progress;
                this._shape.x = getCoordFromProgress(this.curNode.x, this.destinationNode.x);
                this._shape.y = getCoordFromProgress(this.curNode.y, this.destinationNode.y);
            }
        }
        else {
            this._shape.x = this.curNode.x;
            this._shape.y = this.curNode.y;
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