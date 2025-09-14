import readline from 'readline';
import UserService from '../services/UserService.js';
import { IUser, ICommandHandler } from '../interfaces/IUser.js';

export class CLI {
  private userService: UserService;
  private rl: readline.Interface;
  private isRunning: boolean;

  constructor() {
    this.userService = new UserService();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.isRunning = false;
  }

  public start(): void {
    this.isRunning = true;
    this.showWelcomeMessage();
    this.showHelp();
    this.promptUser();
  }

  public stop(): void {
    this.isRunning = false;
    this.rl.close();
    console.log('\nGoodbye!');
  }

  private showWelcomeMessage(): void {
    console.log('\nWelcome to User Management CLI!');
    console.log('=====================================');
  }

  private showHelp(): void {
    console.log('\nAvailable commands:');
    console.log('  create <username>  - Create a new user');
    console.log('  list              - List all users');
    console.log('  find <username>   - Find user by username');
    console.log('  update <old> <new> - Update user username');
    console.log('  delete <username> - Delete user by username');
    console.log('  addpoints <user> <points> - Add points to user');
    console.log('  updatepoint <user> <index> <points> - Update user point');
    console.log('  deletepoint <user> <index> - Delete user point');
    console.log('  count             - Show total user count');
    console.log('  clear             - Clear all users');
    console.log('  help              - Show this help message');
    console.log('  exit              - Exit the application');
    console.log('\nExample: create john_doe');
  }

  private promptUser(): void {
    if (!this.isRunning) return;
    
    this.rl.question('\n> ', (input: string) => {
      this.handleCommand(input.trim());
    });
  }

  private handleCommand(input: string): void {
    if (!input) {
      this.promptUser();
      return;
    }

    const parts = input.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    const commandHandlers: Record<string, ICommandHandler> = {
      create: this.handleCreate.bind(this),
      list: this.handleList.bind(this),
      find: this.handleFind.bind(this),
      update: this.handleUpdate.bind(this),
      delete: this.handleDelete.bind(this),
      addpoints: this.handleAddPoints.bind(this),
      updatepoint: this.handleUpdatePoint.bind(this),
      deletepoint: this.handleDeletePoint.bind(this),
      count: this.handleCount.bind(this),
      clear: this.handleClear.bind(this),
      help: this.showHelp.bind(this),
      exit: () => this.stop()
    };

    const handler = commandHandlers[command];
    if (handler) {
      if (command === 'exit') {
        handler(args);
        return;
      }
      handler(args);
    } else {
      console.log('Unknown command. Type "help" for available commands.');
    }

    this.promptUser();
  }

  private handleCreate(args: string[]): void {
    if (args.length === 0) {
      console.log('Please provide a username. Usage: create <username>');
      return;
    }

    const username = args.join(' ');
    const result = this.userService.createUser(username);
    
    if (result.success) {
      console.log(`${result.message}`);
      console.log(`   ID: ${result.data!.id}`);
      console.log(`   Created: ${result.data!.createdAt.toLocaleString()}`);
    } else {
      console.log(`${result.message}`);
    }
  }

  private handleList(): void {
    const result = this.userService.getAllUsers();
    
    if (result.success) {
      console.log(`\n${result.message}`);
      if (result.data!.length === 0) {
        console.log('   No users found.');
      } else {
        result.data!.forEach((user: IUser, index: number) => {
          console.log(`   ${index + 1}. ${user.username} (ID: ${user.id})`);
          console.log(`      Created: ${user.createdAt.toLocaleString()}`);
          if (user.points && user.points.length > 0) {
            console.log(`      Points:`);
            user.points.forEach((point, pointIndex) => {
              console.log(`        ${pointIndex}. ${point.number} points (${point.datetime.toLocaleString()})`);
            });
          } else {
            console.log(`      Points: None`);
          }
        });
      }
    } else {
      console.log(`${result.message}`);
    }
  }

  private handleFind(args: string[]): void {
    if (args.length === 0) {
      console.log('Please provide a username. Usage: find <username>');
      return;
    }

    const username = args.join(' ');
    const result = this.userService.getUserByUsername(username);
    
    if (result.success) {
      console.log(`${result.message}`);
      console.log(`   ID: ${result.data!.id}`);
      console.log(`   Created: ${result.data!.createdAt.toLocaleString()}`);
      if (result.data!.points && result.data!.points.length > 0) {
        console.log(`   Points:`);
        result.data!.points.forEach((point, pointIndex) => {
          console.log(`     ${pointIndex}. ${point.number} points (${point.datetime.toLocaleString()})`);
        });
      } else {
        console.log(`   Points: None`);
      }
    } else {
      console.log(`${result.message}`);
    }
  }

  private handleUpdate(args: string[]): void {
    if (args.length < 2) {
      console.log('Please provide both old and new username. Usage: update <old_username> <new_username>');
      return;
    }

    const currentUsername = args[0];
    const newUsername = args.slice(1).join(' ');
    const result = this.userService.updateUser(currentUsername, newUsername);
    
    if (result.success) {
      console.log(`${result.message}`);
      console.log(`   New ID: ${result.data!.id}`);
    } else {
      console.log(`${result.message}`);
    }
  }

  private handleDelete(args: string[]): void {
    if (args.length === 0) {
      console.log('Please provide a username. Usage: delete <username>');
      return;
    }

    const username = args.join(' ');
    const result = this.userService.deleteUser(username);
    
    if (result.success) {
      console.log(`${result.message}`);
    } else {
      console.log(`${result.message}`);
    }
  }

  private handleCount(): void {
    const result = this.userService.getUserCount();
    
    if (result.success) {
      console.log(`${result.message}`);
    } else {
      console.log(`${result.message}`);
    }
  }

  private handleClear(): void {
    this.rl.question('Are you sure you want to clear all users? (y/N): ', (answer: string) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        const result = this.userService.clearAllUsers();
        if (result.success) {
          console.log(`${result.message}`);
        } else {
          console.log(`${result.message}`);
        }
      } else {
        console.log('Operation cancelled.');
      }
    });
  }

  private handleAddPoints(args: string[]): void {
    if (args.length < 2) {
      console.log('Please provide username and points. Usage: addpoints <username> <points>');
      return;
    }

    const [username, points] = args;
    const result = this.userService.addPoints(username, parseInt(points));
    
    if (result.success) {
      console.log(`${result.message}`);
    } else {
      console.log(`${result.message}`);
    }
  }

  private handleUpdatePoint(args: string[]): void {
    if (args.length < 3) {
      console.log('Please provide username, point index, and new points. Usage: updatepoint <username> <index> <points>');
      return;
    }

    const [username, pointIndex, newPoints] = args;
    const result = this.userService.updatePoint(username, parseInt(pointIndex), parseInt(newPoints));
    
    if (result.success) {
      console.log(`${result.message}`);
    } else {
      console.log(`${result.message}`);
    }
  }

  private handleDeletePoint(args: string[]): void {
    if (args.length < 2) {
      console.log('Please provide username and point index. Usage: deletepoint <username> <index>');
      return;
    }

    const [username, pointIndex] = args;
    const result = this.userService.deletePoint(username, parseInt(pointIndex));
    
    if (result.success) {
      console.log(`${result.message}`);
    } else {
      console.log(`${result.message}`);
    }
  }
}

export default CLI;
