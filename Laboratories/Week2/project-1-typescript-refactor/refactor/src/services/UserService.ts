import UserRepository from '../repositories/UserRepository.js';
import { IUser, IUserService, IResult } from '../interfaces/IUser.js';

export class UserService implements IUserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  private createResult<T>(success: boolean, data?: T, message: string = ''): IResult<T> {
    return { success, data, message };
  }

  private validateInput<T>(value: T, validator: (val: T) => boolean, errorMessage: string): IResult<T> | null {
    if (!validator(value)) {
      return this.createResult<T>(false, undefined, errorMessage);
    }
    return null;
  }

  public createUser(username: string): IResult<IUser> {
    try {
      const trimmedUsername = username?.trim() || '';
      
      if (!trimmedUsername) {
        return this.createResult<IUser>(false, undefined, 'Username cannot be empty');
      }

      if (trimmedUsername.length < 3) {
        return this.createResult<IUser>(false, undefined, 'Username must be at least 3 characters long');
      }

      const user = this.userRepository.create(trimmedUsername);
      return this.createResult(true, user, `User '${trimmedUsername}' created successfully`);
    } catch (error) {
      return this.createResult<IUser>(false, undefined, (error as Error).message);
    }
  }

  public getAllUsers(): IResult<IUser[]> {
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
        message: (error as Error).message
      };
    }
  }

  public getUserByUsername(username: string): IResult<IUser> {
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
        message: (error as Error).message
      };
    }
  }

  public updateUser(currentUsername: string, newUsername: string): IResult<IUser> {
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
        message: (error as Error).message
      };
    }
  }

  public deleteUser(username: string): IResult<void> {
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
        message: (error as Error).message
      };
    }
  }

  public getUserCount(): IResult<number> {
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
        message: (error as Error).message
      };
    }
  }

  public clearAllUsers(): IResult<void> {
    try {
      this.userRepository.clear();
      return {
        success: true,
        message: 'All users cleared successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message
      };
    }
  }

  public addPoints(username: string, points: number): IResult<IUser> {
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

      const user = this.userRepository.addPoints(username.trim(), parseInt(points.toString()));
      return {
        success: true,
        data: user,
        message: `Added ${points} points to user '${username}'`
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message
      };
    }
  }

  public updatePoint(username: string, pointIndex: number, newPoints: number): IResult<IUser> {
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

      const user = this.userRepository.updatePoint(username.trim(), parseInt(pointIndex.toString()), parseInt(newPoints.toString()));
      return {
        success: true,
        data: user,
        message: `Updated point ${pointIndex} to ${newPoints} for user '${username}'`
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message
      };
    }
  }

  public deletePoint(username: string, pointIndex: number): IResult<IUser> {
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

      const user = this.userRepository.deletePoint(username.trim(), parseInt(pointIndex.toString()));
      return {
        success: true,
        data: user,
        message: `Deleted point ${pointIndex} for user '${username}'`
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message
      };
    }
  }
}

export default UserService;
