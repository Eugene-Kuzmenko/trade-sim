/**
 * Returns mouse position relative to the center of event target
 * @param {MouseEvent} event - Mouse event of container
 * @returns {Point}
 */
export default function getOffcenterMouseCoord(event) {
  const halfWidth = event.target.offsetWidth * 0.5;
  const halfHeight = event.target.offsetHeight * 0.5;
  return {
    x: event.offsetX - halfWidth,
    y: event.offsetY - halfHeight
  }
}