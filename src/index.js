import "regenerator-runtime/runtime.js";
import Engine from './Engine'

const WIDTH = 1024;
const HEIGHT = 768;

window.onload = function () {
  const engine = new Engine(document, WIDTH, HEIGHT);
  engine.attachToElement(document.getElementById('canvas-container'));
  engine.render();
  setInterval(() => {engine.update()}, 50);
  setInterval(() => {engine.renderAgents()}, 5);
};
