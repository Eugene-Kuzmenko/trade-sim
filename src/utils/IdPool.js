/**
 * Helper class, that gives number IDs
 */
export default class IdPool {
  constructor() {
    this.vacantIds = [];
    this.highestId = 0;
  }

  /**
   * Returns unique numeric ID
   * @returns {number}
   */
  getId() {
    if (this.vacantIds.length > 0) {
      return this.vacantIds.pop();
    }
    this.highestId++;
    return this.highestId;
  }
  
  /**
   * Allows ID to be usable by another object
   * @param {number} - Id to let go of
   */
  releaseId(id) {
    if (this.highestId == id) {
      this.highestId --
      return;
    };
    this.vacantIds.push(id);
  }
}