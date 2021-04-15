export default class FileLoad {
  constructor(handler) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.addEventListener('change', handler);
    this.element = fileInput;
  }
}