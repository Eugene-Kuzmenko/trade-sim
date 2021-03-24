import "regenerator-runtime/runtime.js";
import Editor from './Editor';
import Engine from './Engine';
import defaultGraph from './default_graph.json';

function main() {
  const engine = new Engine(document, defaultGraph, WIDTH, HEIGHT);
  const canvasContainer = document.getElementById('canvas-container');
  engine.attachToElement(canvasContainer);
  engine.renderAll();
  setInterval(() => {engine.update()}, 50);
  setInterval(() => {engine.renderAgents()}, 5);

  const editor = new Editor({
    onAddNode: (x, y) => engine.handleEditorAddNode(x, y),
    onSelectNode: (x, y) => engine.handleEditorSelectNode(x, y),
    onAddEdge: (nodeId, x, y) => engine.handleEditorAddEdge(nodeId, x, y),
    onLoadGraph: (graph) => engine.handleEditorLoadGraph(graph),
  })

  document.getElementById('add-node').addEventListener('click', (event) => {
    editor.handleAddNodeButtonClick(event);
  });

  document.getElementById('add-edge').addEventListener('click', (event) => {
    editor.handleAddEdgeButtonClick(event);
  });

  document.getElementById('load-graph').addEventListener('change', (event) => {
    editor.handleLoadGraphFileChange(event);
  })

  canvasContainer.addEventListener('mouseup', (event) => {
    editor.handleMouseClick(event);
  });
};

const WIDTH = 1024;
const HEIGHT = 768;

main();
