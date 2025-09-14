import readline from 'readline';
import UserService from '../services/UserService.js';

class CLI {
  constructor() {
    this.userService = new UserService();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.isRunning = false;
  }

  start() {
    this.isRunning = true;
    this.showWelcomeMessage();
    this.showHelp();
    this.promptUser();
  }

  stop() {
    this.isRunning = false;
    this.rl.close();
    console.log('\nGoodbye!');
  }

  showWelcomeMessage() {
    console.log('\nWelcome to User Management CLI!');
    console.log('=====================================');
  }

  showHelp() {
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

  promptUser() {
    if (!this.isRunning) return;
    
    this.rl.question('\n> ', (input) => {
      this.handleCommand(input.trim());
    });
  }

  handleCommand(input) {
    if (!input) {
      this.promptUser();
      return;
    }

    const parts = input.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case 'create':
        this.handleCreate(args);
        break;
      case 'list':
        this.handleList();
        break;
      case 'find':
        this.handleFind(args);
        break;
      case 'update':
        this.handleUpdate(args);
        break;
      case 'delete':
        this.handleDelete(args);
        break;
      case 'addpoints':
        this.handleAddPoints(args);
        break;
      case 'updatepoint':
        this.handleUpdatePoint(args);
        break;
      case 'deletepoint':
        this.handleDeletePoint(args);
        break;
      case 'count':
        this.handleCount();
        break;
      case 'clear':
        this.handleClear();
        break;
      case 'help':
        this.showHelp();
        break;
      case 'exit':
        this.stop();
        return;
      default:
        console.log('Unknown command. Type "help" for available commands.');
    }

    this.promptUser();
  }

  handleCreate(args) {
    if (args.length === 0) {
      console.log('Please provide a username. Usage: create <username>');
      return;
    }

    const username = args.join(' ');
    const result = this.userService.createUser(username);
    
    if (result.success) {
      console.log(`${result.message}`);
      console.log(`   ID: ${result.data.id}`);
      console.log(`   Created: ${result.data.createdAt.toLocaleString()}`);
    } else {
      console.log(`${result.message}`);
    }
  }

  handleList() {
    const result = this.userService.getAllUsers();
    
    if (result.success) {
      console.log(`\n${result.message}`);
      if (result.data.length === 0) {
        console.log('   No users found.');
      } else {
        result.data.forEach((user, index) => {
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

  handleFind(args) {
    if (args.length === 0) {
      console.log('Please provide a username. Usage: find <username>');
      return;
    }

    const username = args.join(' ');
    const result = this.userService.getUserByUsername(username);
    
    if (result.success) {
      console.log(`${result.message}`);
      console.log(`   ID: ${result.data.id}`);
      console.log(`   Created: ${result.data.createdAt.toLocaleString()}`);
      if (result.data.points && result.data.points.length > 0) {
        console.log(`   Points:`);
        result.data.points.forEach((point, pointIndex) => {
          console.log(`     ${pointIndex}. ${point.number} points (${point.datetime.toLocaleString()})`);
        });
      } else {
        console.log(`   Points: None`);
      }
    } else {
      console.log(`${result.message}`);
    }
  }

  handleUpdate(args) {
    if (args.length < 2) {
      console.log('Please provide both old and new username. Usage: update <old_username> <new_username>');
      return;
    }

    const currentUsername = args[0];
    const newUsername = args.slice(1).join(' ');
    const result = this.userService.updateUser(currentUsername, newUsername);
    
    if (result.success) {
      console.log(`${result.message}`);
      console.log(`   New ID: ${result.data.id}`);
    } else {
      console.log(`${result.message}`);
    }
  }

  handleDelete(args) {
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

  handleCount() {
    const result = this.userService.getUserCount();
    
    if (result.success) {
      console.log(`${result.message}`);
    } else {
      console.log(`${result.message}`);
    }
  }

  handleClear() {
    this.rl.question('Are you sure you want to clear all users? (y/N): ', (answer) => {
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

  handleAddPoints(args) {
    if (args.length < 2) {
      console.log('Please provide username and points. Usage: addpoints <username> <points>');
      return;
    }

    const username = args[0];
    const points = args[1];
    const result = this.userService.addPoints(username, points);
    
    if (result.success) {
      console.log(`${result.message}`);
    } else {
      console.log(`${result.message}`);
    }
  }

  handleUpdatePoint(args) {
    if (args.length < 3) {
      console.log('Please provide username, point index, and new points. Usage: updatepoint <username> <index> <points>');
      return;
    }

    const username = args[0];
    const pointIndex = args[1];
    const newPoints = args[2];
    const result = this.userService.updatePoint(username, pointIndex, newPoints);
    
    if (result.success) {
      console.log(`${result.message}`);
    } else {
      console.log(`${result.message}`);
    }
  }

  handleDeletePoint(args) {
    if (args.length < 2) {
      console.log('Please provide username and point index. Usage: deletepoint <username> <index>');
      return;
    }

    const username = args[0];
    const pointIndex = args[1];
    const result = this.userService.deletePoint(username, pointIndex);
    
    if (result.success) {
      console.log(`${result.message}`);
    } else {
      console.log(`${result.message}`);
    }
  }
}

export default CLI;
