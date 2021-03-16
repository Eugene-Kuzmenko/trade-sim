import "regenerator-runtime/runtime.js";
import Editor from "./Editor";
import Engine from './Engine'

const WIDTH = 1024;
const HEIGHT = 768;

window.onload = function () {
  const engine = new Engine(document, WIDTH, HEIGHT);
  const canvasContainer = document.getElementById('canvas-container');
  engine.attachToElement(canvasContainer);
  engine.renderAll();
  setInterval(() => {engine.update()}, 50);
  setInterval(() => {engine.renderAgents()}, 5);

  const editor = new Editor({
    onAddNode: (x, y) => {
      engine.handleEditorAddNode(x, y);
    },
  })

  document.getElementById('add-node').addEventListener('click', (event) => {
    editor.handleAddNodeButtonClick(event);
  });

  canvasContainer.addEventListener('mouseup', (event) => {
    editor.handleMouseClick(event);
  })
};
