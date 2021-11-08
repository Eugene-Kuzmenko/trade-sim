import "regenerator-runtime/runtime.js";
import Editor from './Editor';
import Engine from './Engine';
import defaultGraph from './default_graph.json';
import { Toolbar, FileLoad, Button, SubmitInput } from './ui';

function main() {
  const engine = new Engine(document, defaultGraph, WIDTH, HEIGHT);
  const canvasContainer = document.getElementById('canvas-container');
  engine.attachToElement(canvasContainer);
  engine.renderAll();
  setInterval(() => {engine.update()}, 50);
  setInterval(() => {engine.renderAgents()}, 5);

  const inputSaveFile = document.getElementById('save-file-name');

  const editor = new Editor({
    onAddNode: (x, y) => engine.handleEditorAddNode(x, y),
    onSelectNode: (x, y) => engine.handleEditorSelectNode(x, y),
    onAddEdge: (nodeId, x, y) => engine.handleEditorAddEdge(nodeId, x, y),
    onAddAgent: (nodeId) => engine.handleEditorAddAgent(nodeId),
    onLoadGraph: (graph) => engine.handleEditorLoadGraph(graph),
    onSaveGraph: () => engine.handleEditorSaveGraph(),
    onSetAgentPath: (nodeId, x, y) => engine.handleEditorSetAgentPath(nodeId, x, y)
  })

  const toolbar = new Toolbar([
    new Button('Add Node', (event) => {
      editor.handleAddNodeButtonClick(event);
    }),
    new Button('Add Edge', (event) => {
      editor.handleAddEdgeButtonClick(event);
    }),
    new Button('Add Agent', (event) => {
      editor.handleAddAgentButtonClick(event);
    }),
    new Button('Set AgentPath', (event) => {
      editor.handleSetAgentPath(event);
    }),
    new FileLoad((event) => {
      editor.handleLoadGraphFileChange(event);
    }),
    new SubmitInput('Save Graph', (value) => {
      editor.handleSaveGraphButtonClick(document, value);
    })
  ]);

  document.getElementById('toolbar').append(toolbar.element);

  canvasContainer.addEventListener('mouseup', (event) => {
    editor.handleMouseClick(event);
  });
};

const WIDTH = 1024;
const HEIGHT = 768;

main();
