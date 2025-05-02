import pino from 'pino';

export class Logger {
  private logger;

  constructor() {
    this.logger = pino({
      level: 'info',
      transport: { target: 'pino-pretty' }
    });
  }

  info(message: string) {
    this.logger.info(message);
  }

  error(message: string) {
    this.logger.error(message);
  }
}
