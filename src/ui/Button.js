export default class Button {
  constructor(name, handler) {
    const btn = document.createElement('button');
    btn.textContent = name;
    btn.addEventListener('click', handler);
    this.element = btn;
  } 
}