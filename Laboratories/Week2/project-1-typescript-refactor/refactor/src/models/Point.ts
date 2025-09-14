import { IPoint, IPointData } from '../interfaces/IUser.js';

export class Point implements IPoint {
  public readonly number: number;
  public readonly datetime: Date;

  constructor(number: number) {
    this.number = number;
    this.datetime = new Date();
  }

  public toJSON(): IPointData {
    return {
      number: this.number,
      datetime: this.datetime.toISOString()
    };
  }

  public static fromJSON(data: IPointData): Point {
    const point = new Point(data.number);
    (point as any).datetime = new Date(data.datetime);
    return point;
  }
}

export default Point;
