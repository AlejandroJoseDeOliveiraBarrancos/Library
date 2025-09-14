class User {
  constructor(username) {
    this.username = username;
    this.id = this.generateId();
    this.createdAt = new Date();
    this.points = [];
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      createdAt: this.createdAt,
      points: this.points
    };
  }

  static fromJSON(data) {
    const user = new User(data.username);
    user.id = data.id;
    user.createdAt = new Date(data.createdAt);
    user.points = data.points || [];
    return user;
  }
}

export default User;
