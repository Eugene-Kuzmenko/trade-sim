/**
 * Helper class, that gives number IDs
 */
export default class IdPool {
  constructor() {
    this.vacantIds = [];
    this.highestId = 0;
  }

  /**
   * Returns unique numeric ID. If id is passed, it would reserve that ID
   * @params {number | null} existingId - id, that object already has and needs to be reserved
   * @returns {number}
   */
  getId(existingId = null) {
    if (existingId !== null) {
      this.reserveId(existingId);
      return existingId;
    }
    if (this.vacantIds.length > 0) {
      return this.vacantIds.pop();
    }
    this.highestId++;
    return this.highestId;
  }
  
  /**
   * Allows ID to be given to another object
   * @param {number} - ID to let go of
   */
  releaseId(id) {
    if (this.highestId == id) {
      this.highestId--;
      return;
    };
    this.vacantIds.push(id);
  }

  /**
   * Marks id as taken, so it won't be given away to other object
   * @param {number} id 
   * @returns 
   */
  reserveId(id) {
    const vacantIdIndex = this.vacantIds.indexOf(id);
    if (vacantIdIndex > 0) {
      this.vacantIds.splice(vacantIdIndex, 1);
      return;
    }
    if (id > this.highestId) {
      this._vacateGap(this.highestId, id);
      this.highestId = id;
    }
  }

  /**
   * Marks ids between ids as vacant
   * @param fromId {number} - smaller id
   * @param toId {number} - bigger id
   */
  _vacateGap(fromId, toId) {
    const gap = fromId - toId;
    for (let inc = 1; inc < gap; inc++) {
      this.vacantIds.push(prevId + inc);
    } 
  }

  /**
   * Mark all ids as occupied and all others as vacant
   * @param {number[]} - iterable that contains ids taken
   */
  registerIds(ids) {
    const sortedIds = [...ids].sort((a, b) => a - b);
    for (let i = 1; i < sortedIds.length; i++) {
      this._vacateGap(sortedIds[i - 1], sortedIds[i]);
    }
  }
}