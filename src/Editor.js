import { getOffCenterMouseCoord, saveJsonFile } from "./utils";

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

  handleAddNodeButtonClick() {
    this.setMode(Modes.ADD_NODE);
  }
  
  handleAddEdgeButtonClick() {
    this.setMode(Modes.ADD_EDGE);
  }

  handleAddAgentButtonClick() {
    this.setMode(Modes.ADD_AGENT);
  }

  handleSetAgentPath() {
    this.setMode(Modes.SET_AGENT_PATH);
  }

  setMode(mode) {
    this.mode = mode;
    this.selectedNode = null;
  }
  
  async handleLoadGraphFileChange(event) {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const graph = JSON.parse(await file.text());
      this.handlers.onLoadGraph(graph);
    }
  }

  handleSaveGraphButtonClick(document, fileName) {
    saveJsonFile(document, this.handlers.onSaveGraph(), fileName)
  }

  _withSelectedNode(event, callback) {
    const point = getOffCenterMouseCoord(event);
    if (this.selectedNode == null) {
      // Selecting first node
      this.selectedNode = this.handlers.onSelectNode(point.x, point.y);
    } else {
      callback(this.selectedNode, point)
      // Resetting selected node to be able to make new connection
      this.selectedNode = null;
    }
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
            this._withSelectedNode(event, (node, point) => {
              this.handlers.onAddEdge(node, point.x, point.y);
            })
            break;
          }
          case Modes.ADD_AGENT: {
            const point = getOffCenterMouseCoord(event);
            const nodeId = this.handlers.onSelectNode(point.x, point.y);
            if (!nodeId) break;
            this.handlers.onAddAgent(nodeId);
            break;
          }
          case Modes.SET_AGENT_PATH: {
            this._withSelectedNode(event, (startNode, point) => {
              this.handlers.onSetAgentPath(startNode, point.x, point.y)
            })
            const point = getOffCenterMouseCoord(event);
            const nodeId = this.handlers.onSelectNode(point.x, point.y);
            if (!nodeId) break;
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
  ADD_AGENT: 'add_agent',
  SET_AGENT_PATH: 'set_agent_path',
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
 * @property {AddAgentHandler} onAddAgent
 * @property {LoadGraphHandler} onLoadGraph
 * @property {SaveGraphHandler} onSaveGraph
 * @property {SetAgentPathHandler} onSetAgentPath
 */


/**
 * Callback called then editor wants to make agent travel between 2 nodes
 * @callback SetAgentPathHandler
 * @param {unique} startNodeId - id of the origin node, where agent is located
 * @param {number} screenX - x position of a mouse relative to the element center
 * @param {number} screenY - y position of a mouse relative to the element center
 */

/**
 * Callback called then editor wants to add a node
 * @callback AddNodeHandler
 * @param {number} screenX - x position of a mouse relative to the element center
 * @param {number} screenY - y position of a mouse relative to the element center
 */

 /**
 * Callback called then editor wants to add a node
 * @callback AddAgentHandler
 * @param {Node} node - Node to which agent would be added

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


/**
 * Callback called then edior attempts to load graph
 * @callback LoadGraphHandler
 * @param {PlainGraph} graph - plain representation of the graph (no logic)
 */


/**
 * Callback called then edior attempts to save graph into a file
 * @callback SaveGraphHandler
 * @returns {PlainGraph} graph - plain representation of the graph (no logic)
 */