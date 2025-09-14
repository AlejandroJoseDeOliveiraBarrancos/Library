import User from '../models/User.js';
import Point from '../models/Point.js';
import { IUser, IUserRepository } from '../interfaces/IUser.js';

export class UserRepository implements IUserRepository {
  private users: Set<User>;

  constructor() {
    this.users = new Set();
  }

  public create(username: string): IUser {
    if (this.findByUsername(username)) {
      throw new Error(`User with username '${username}' already exists`);
    }
    
    const user = new User(username);
    this.users.add(user);
    return user;
  }

  public findByUsername(username: string): IUser | null {
    for (const user of this.users) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  public findById(id: string): IUser | null {
    for (const user of this.users) {
      if (user.id === id) {
        return user;
      }
    }
    return null;
  }

  public findAll(): IUser[] {
    return Array.from(this.users);
  }

  public update(id: string, newUsername: string): IUser {
    const user = this.findById(id);
    if (!user) {
      throw new Error(`User with ID '${id}' not found`);
    }

    const existingUser = this.findByUsername(newUsername);
    if (existingUser && existingUser.id !== id) {
      throw new Error(`Username '${newUsername}' already exists`);
    }

    user.username = newUsername;
    return user;
  }

  public delete(id: string): boolean {
    const user = this.findById(id);
    if (user) {
      this.users.delete(user as User);
      return true;
    }
    return false;
  }

  public deleteByUsername(username: string): boolean {
    const user = this.findByUsername(username);
    if (user) {
      this.users.delete(user as User);
      return true;
    }
    return false;
  }

  public count(): number {
    return this.users.size;
  }

  public clear(): void {
    this.users.clear();
  }

  public addPoints(username: string, points: number): IUser {
    const user = this.findByUsername(username);
    if (!user) {
      throw new Error(`User with username '${username}' not found`);
    }
    
    const point = new Point(points);
    user.points.push(point);
    return user;
  }

  public updatePoint(username: string, pointIndex: number, newPoints: number): IUser {
    const user = this.findByUsername(username);
    if (!user) {
      throw new Error(`User with username '${username}' not found`);
    }
    
    if (pointIndex < 0 || pointIndex >= user.points.length) {
      throw new Error(`Point index ${pointIndex} is out of range`);
    }
    
    user.points[pointIndex].number = newPoints;
    return user;
  }

  public deletePoint(username: string, pointIndex: number): IUser {
    const user = this.findByUsername(username);
    if (!user) {
      throw new Error(`User with username '${username}' not found`);
    }
    
    if (pointIndex < 0 || pointIndex >= user.points.length) {
      throw new Error(`Point index ${pointIndex} is out of range`);
    }
    
    user.points.splice(pointIndex, 1);
    return user;
  }
}

export default UserRepository;
