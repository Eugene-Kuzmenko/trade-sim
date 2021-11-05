/**
 * Finds shortest path by checking nearby edges
 * @param start {Node} - origin node
 * @param endId {id} - id of destination node
 */
export default function breathFirstSearch(start, endId) {
  const toVisit = [];
  const seenNodeIds = new Set();
  toVisit.push({ node: start, fromEdge: null, prevStep: null });
  seenNodeIds.add(start.id)

  for (let step of toVisit) {
    if (step.node.id === endId) return backtrackPath(step);

    for (let edge of step.node.edges) {
      const node = edge.getOtherNode(step.node.id);
      if (seenNodeIds.has(node.id)) continue;
      seenNodeIds.add(node.id);

      toVisit.push({ prevStep: step, fromEdge: edge, node })
    }
  }

  return []
}

/**
 * Backtracks steps to form a path
 * @param step
 * @returns {Edge[]}
 */
function backtrackPath(step) {
  const reversePath = [];
  while (step.fromEdge !== null) {
    reversePath.push(step.fromEdge);
    step = step.prevStep;
  }
  return reversePath.reverse();
}