import { EdgeLine } from '../render/shapes';

export default class Edge {
  constructor(start, end) {
    this.start = start;
    this.end = end;
    this.shape = new EdgeLine(start, end, 'green', 3)
  }
}