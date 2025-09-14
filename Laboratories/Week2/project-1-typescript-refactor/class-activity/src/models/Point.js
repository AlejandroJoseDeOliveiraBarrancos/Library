class Point {
  constructor(number) {
    this.number = number;
    this.datetime = new Date();
  }

  toJSON() {
    return {
      number: this.number,
      datetime: this.datetime
    };
  }

  static fromJSON(data) {
    const point = new Point(data.number);
    point.datetime = new Date(data.datetime);
    return point;
  }
}

export default Point;
