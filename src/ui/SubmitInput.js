import Button from './Button';

export default class SubmitInput {
  /***
   * @param {string} name - Button title
   * @param {SubmitHandler} handler - Submit button handler
   */
  constructor(name, handler) {
    this.element = document.createElement('div');
    this.input = document.createElement('input');
    this.element.appendChild(this.input);
    this.submitBtn = new Button(name, () => {
      handler(input.value);
    });
    this.element.appendChild(this.submitBtn.element);
  } 
}

/**
 * @callback SubmitHandler
 * @param {string} value - inserted value
 */