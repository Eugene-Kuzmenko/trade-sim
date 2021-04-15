/**
 * UI component, that allows to easily add buttons
 */
export default class Toolbar {
  constructor(components) {
    this.element = document.createElement('div');
    for (let component of components) {
      this.appendChild(component);
    }
  };

  /**
   * Appends component's element
   * @param {Component} component 
   */
  appendChild(component) {
    this.element.appendChild(component.element);
  }
}

/**
 * @typedef Component
 * @property element
 */