/**
 * Helper function that iterates over shapes of the collection
 * @param {IHasShape[]} collection - iterable collection with objects that has shape
 * @yields Shape
 */
function * iterShapes(collection) {
  for (let item of collection) {
    yield item.shape;
  }
}

export default iterShapes;

/**
 * Shape for the render to render
 * @typedef {object} Shape
 * @property {string} type - shape type, which determines what shape render renders
 * @property {number} y
 * @property {number} y
 */

/**
 * Object that has shape property
 * @typedef {object} IHasShape
 * @propert {Shape} shape - Shape of an object
 */