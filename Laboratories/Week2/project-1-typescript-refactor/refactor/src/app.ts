import CLI from './cli/CLI.js';

export class UserManagementApp {
  private cli: CLI;

  constructor() {
    this.cli = new CLI();
  }

  public start(): void {
    process.on('SIGINT', () => {
      console.log('\nReceived SIGINT, shutting down gracefully...');
      this.stop();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\nReceived SIGTERM, shutting down gracefully...');
      this.stop();
      process.exit(0);
    });

    process.on('uncaughtException', (error: Error) => {
      console.error('Uncaught Exception:', error);
      this.stop();
      process.exit(1);
    });

    process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      this.stop();
      process.exit(1);
    });

    this.cli.start();
  }

  public stop(): void {
    this.cli.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const app = new UserManagementApp();
  app.start();
}

export default UserManagementApp;
