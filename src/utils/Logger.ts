import winston, { Logger as WinstonLogger } from "winston";

class Logger {
  private logger: WinstonLogger;

  constructor() {
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((info: winston.Logform.TransformableInfo) => {
          return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`;
        })
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "logs/app.log" }),
      ],
    });
  }

  public info(message: string): void {
    this.logger.info(message);
  }

  public error(message: string, error?: Error): void {
    this.logger.error(`${message} - ${error?.stack || error}`);
  }
}

export default new Logger();
