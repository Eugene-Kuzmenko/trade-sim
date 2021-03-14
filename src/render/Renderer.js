import Layer from './Layer';



/**
 * Abstraction, which wraps multilayer rendering implementation
 */
export default class Renderer {
  constructor(doc, width, height, layer_names) {
    this.height = height;
    this.width = width;

    this._layer_names = layer_names;
    this.layers = {};
    for (let layer_name of layer_names) {
      this.layers[layer_name] = new Layer(doc, layer_name, width, height)
    }
  }

  /**
   * Inserts rendering elements to the DOM as a child of element you'll specify
   * @param {HTMLElement} parent - element to which rendering elements would be attached to 
   */
  attachToElement(parent) {
    for (let layer_name of this._layer_names) {
      if (!this.layers[layer_name]) continue;
      parent.appendChild(this.layers[layer_name].canvas);
    }
  }
  /**
   * Moves viewport center to the specified position for rendering 
   * @param {number} x - viewport center x coordinate
   * @param {number} y - viewport center y coordinate
   * @param {RenderingTask[]} renderingTasks - functions that would perform things to a layer while it's transformed
   */
  withViewportCentered(x, y, renderingTasks) {
    let halfViewWidth = this.width * 0.5;
    let halfViewHeight = this.height * 0.5;

    for (let layer_name of this._layer_names) {
      const layer = this.layers[layer_name];
      const renderingTask = renderingTasks[layer_name];
      if (layer && renderingTask) {
        layer.withTranslate(
          halfViewWidth - x,
          halfViewHeight - y,
          renderingTask,
        );
      }
    }
  }
}

