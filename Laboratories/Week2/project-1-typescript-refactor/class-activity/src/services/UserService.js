import UserRepository from '../repositories/UserRepository.js';

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  createUser(username) {
    try {
      if (!username || username.trim() === '') {
        return {
          success: false,
          message: 'Username cannot be empty'
        };
      }

      const trimmedUsername = username.trim();
      if (trimmedUsername.length < 3) {
        return {
          success: false,
          message: 'Username must be at least 3 characters long'
        };
      }

      const user = this.userRepository.create(trimmedUsername);
      return {
        success: true,
        data: user,
        message: `User '${trimmedUsername}' created successfully`
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  getAllUsers() {
    try {
      const users = this.userRepository.findAll();
      return {
        success: true,
        data: users,
        message: `Found ${users.length} user(s)`
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  getUserByUsername(username) {
    try {
      if (!username || username.trim() === '') {
        return {
          success: false,
          message: 'Username cannot be empty'
        };
      }

      const user = this.userRepository.findByUsername(username.trim());
      if (user) {
        return {
          success: true,
          data: user,
          message: `User '${username}' found`
        };
      } else {
        return {
          success: false,
          message: `User '${username}' not found`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  updateUser(currentUsername, newUsername) {
    try {
      if (!currentUsername || currentUsername.trim() === '') {
        return {
          success: false,
          message: 'Current username cannot be empty'
        };
      }

      if (!newUsername || newUsername.trim() === '') {
        return {
          success: false,
          message: 'New username cannot be empty'
        };
      }

      const trimmedNewUsername = newUsername.trim();
      if (trimmedNewUsername.length < 3) {
        return {
          success: false,
          message: 'New username must be at least 3 characters long'
        };
      }

      const user = this.userRepository.findByUsername(currentUsername.trim());
      if (!user) {
        return {
          success: false,
          message: `User '${currentUsername}' not found`
        };
      }

      const updatedUser = this.userRepository.update(user.id, trimmedNewUsername);
      return {
        success: true,
        data: updatedUser,
        message: `User '${currentUsername}' updated to '${trimmedNewUsername}' successfully`
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  deleteUser(username) {
    try {
      if (!username || username.trim() === '') {
        return {
          success: false,
          message: 'Username cannot be empty'
        };
      }

      const deleted = this.userRepository.deleteByUsername(username.trim());
      if (deleted) {
        return {
          success: true,
          message: `User '${username}' deleted successfully`
        };
      } else {
        return {
          success: false,
          message: `User '${username}' not found`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  getUserCount() {
    try {
      const count = this.userRepository.count();
      return {
        success: true,
        data: count,
        message: `Total users: ${count}`
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  clearAllUsers() {
    try {
      this.userRepository.clear();
      return {
        success: true,
        message: 'All users cleared successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  addPoints(username, points) {
    try {
      if (!username || username.trim() === '') {
        return {
          success: false,
          message: 'Username cannot be empty'
        };
      }

      if (isNaN(points) || points < 0) {
        return {
          success: false,
          message: 'Points must be a positive number'
        };
      }

      const user = this.userRepository.addPoints(username.trim(), parseInt(points));
      return {
        success: true,
        data: user,
        message: `Added ${points} points to user '${username}'`
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  updatePoint(username, pointIndex, newPoints) {
    try {
      if (!username || username.trim() === '') {
        return {
          success: false,
          message: 'Username cannot be empty'
        };
      }

      if (isNaN(pointIndex) || pointIndex < 0) {
        return {
          success: false,
          message: 'Point index must be a non-negative number'
        };
      }

      if (isNaN(newPoints) || newPoints < 0) {
        return {
          success: false,
          message: 'Points must be a positive number'
        };
      }

      const user = this.userRepository.updatePoint(username.trim(), parseInt(pointIndex), parseInt(newPoints));
      return {
        success: true,
        data: user,
        message: `Updated point ${pointIndex} to ${newPoints} for user '${username}'`
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  deletePoint(username, pointIndex) {
    try {
      if (!username || username.trim() === '') {
        return {
          success: false,
          message: 'Username cannot be empty'
        };
      }

      if (isNaN(pointIndex) || pointIndex < 0) {
        return {
          success: false,
          message: 'Point index must be a non-negative number'
        };
      }

      const user = this.userRepository.deletePoint(username.trim(), parseInt(pointIndex));
      return {
        success: true,
        data: user,
        message: `Deleted point ${pointIndex} for user '${username}'`
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}

export default UserService;
