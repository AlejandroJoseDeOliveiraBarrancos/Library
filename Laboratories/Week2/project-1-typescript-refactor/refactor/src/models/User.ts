import { IUser, IUserData } from '../interfaces/IUser.js';
import { Point } from './Point.js';

export class User implements IUser {
  public readonly id: string;
  public username: string;
  public readonly createdAt: Date;
  public points: IPoint[];

  constructor(username: string) {
    this.username = username;
    this.id = this.generateId();
    this.createdAt = new Date();
    this.points = [];
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  public toJSON(): IUserData {
    return {
      id: this.id,
      username: this.username,
      createdAt: this.createdAt.toISOString(),
      points: this.points.map(point => point.toJSON())
    };
  }

  public static fromJSON(data: IUserData): User {
    const user = new User(data.username);
    (user as any).id = data.id;
    (user as any).createdAt = new Date(data.createdAt);
    user.points = data.points?.map(pointData => Point.fromJSON(pointData)) || [];
    return user;
  }
}

import { IPoint } from '../interfaces/IUser.js';

export default User;
