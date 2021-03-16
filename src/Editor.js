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
  }

  /**
   * Handler for the click of "Add Node" button
   */
  handleAddNodeButtonClick() {
    this.mode = Modes.ADD_NODE;
  }

  /**
   * Handles click of the mouse click
   * @param {MouseEvent} event - Mouse event
   */
  handleMouseClick(event) {

    switch (event.button) {
      case MouseButton.LEFT:
        switch (this.mode) {
          case Modes.ADD_NODE:
            const hw = event.target.offsetWidth * 0.5;
            const hh = event.target.offsetHeight * 0.5;
            this.handlers.onAddNode(event.offsetX - hw, event.offsetY - hh);
            break;
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
}

const MouseButton = {
  LEFT: 0,
  RIGHT: 1,
}


/**
 * Callback called then editor wants to add a node
 * @callback AddNodeHandler
 * @param {number} screenX - x position of a mouse relative to the element edges
 * @param {number} screenY - y position of a mouse relative to the element edges
 */


/**
 * Map of Editor handlers
 * @typedef {object} Handlers
 * @property {AddNodeHandler} onAddNode
 */