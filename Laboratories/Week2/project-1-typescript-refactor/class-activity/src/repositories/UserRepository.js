import User from '../models/User.js';
import Point from '../models/Point.js';

class UserRepository {
  constructor() {
    this.users = new Set();
  }

  create(username) {
    if (this.findByUsername(username)) {
      throw new Error(`User with username '${username}' already exists`);
    }
    
    const user = new User(username);
    this.users.add(user);
    return user;
  }

  findByUsername(username) {
    for (const user of this.users) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  findById(id) {
    for (const user of this.users) {
      if (user.id === id) {
        return user;
      }
    }
    return null;
  }

  findAll() {
    return Array.from(this.users);
  }

  update(id, newUsername) {
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

  delete(id) {
    const user = this.findById(id);
    if (user) {
      this.users.delete(user);
      return true;
    }
    return false;
  }

  deleteByUsername(username) {
    const user = this.findByUsername(username);
    if (user) {
      this.users.delete(user);
      return true;
    }
    return false;
  }

  count() {
    return this.users.size;
  }

  clear() {
    this.users.clear();
  }

  addPoints(username, points) {
    const user = this.findByUsername(username);
    if (!user) {
      throw new Error(`User with username '${username}' not found`);
    }
    
    const point = new Point(points);
    user.points.push(point);
    return user;
  }

  updatePoint(username, pointIndex, newPoints) {
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

  deletePoint(username, pointIndex) {
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
