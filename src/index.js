import Engine from './Engine'


window.onload = function () {
  const engine = new Engine(document);
  engine.syncCanvasToWindowSize();
  engine.render();
};