import { getOffCenterMouseCoord } from "./utils";

/**
 * Object that manages editing
 * @property {Modes} mode - current mode of the Editor
 */
export default class Editor {
  /**
   * @constructor
   * @param {Handlers} handlers - Map of handlers
   */
  constructor(handlers) {
    this.handlers = handlers;
    this.mode = Modes.IDLE;
    this.selectedNode = null;
  }

  /**
   * Handles click of "Add Node" button
   */
  handleAddNodeButtonClick() {
    this.mode = Modes.ADD_NODE;
  }
  
  /**
   * Handles click of "Add Edge" button
   */
  handleAddEdgeButtonClick() {
    this.mode = Modes.ADD_EDGE;
  }

  /**
   * Handles click of the mouse click
   * @param {MouseEvent} event - Mouse event
   */
  handleMouseClick(event) {

    switch (event.button) {
      case MouseButton.LEFT:
        switch (this.mode) {
          case Modes.ADD_NODE: {
            const point = getOffCenterMouseCoord(event);
            this.handlers.onAddNode(point.x, point.y);
            break;
          }
          case Modes.ADD_EDGE: {
            const point = getOffCenterMouseCoord(event);
            if (this.selectedNode == null) {
              // Selecting first node
              this.selectedNode = this.handlers.onSelectNode(point.x, point.y);
            } else {
              this.handlers.onAddEdge(this.selectedNode, point.x, point.y);
              // Resetting selected node to be able to make new connection
              this.selectedNode = null;
            }
            break;
          }
          default:
            break;
        }
        return;
      case MouseButton.RIGHT:
        this.mode = Modes.IDLE;
        return;
    }
  }
}

const Modes = {
  IDLE: 'idle',
  ADD_NODE: 'add_node',
  ADD_EDGE: 'add_edge',
}

const MouseButton = {
  LEFT: 0,
  RIGHT: 1,
}


/**
 * Map of Editor handlers
 * @typedef {object} Handlers
 * @property {AddNodeHandler} onAddNode
 * @property {SelectNodeHandler} onSelectNode
 * @property {AddEdgeHandler} onAddEdge
 */

/**
 * Callback called then editor wants to add a node
 * @callback AddNodeHandler
 * @param {number} screenX - x position of a mouse relative to the element center
 * @param {number} screenY - y position of a mouse relative to the element center
 */

/**
 * Callback called then editor wants to add a node
 * @callback AddEdgeHandler
 * @param {number} selectedNode - previously selected node
 * @param {number} screenX - x position of a mouse relative to the element center
 * @param {number} screenY - y position of a mouse relative to the element center
 * @return {boolean}
 */

/**
 * Callback called then edior attempts to select a node
 * @callback SelectNodeHandler
 * @param {number} screenX - x position of a mouse relative to the element center
 * @param {number} screenY - y position of a mouse relative to the element center
 * @return {unique | null} - Node id
 */

