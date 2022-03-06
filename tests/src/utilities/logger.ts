import winston from 'winston';

const logger = winston.createLogger({
  // Format.
  format: winston.format.printf((log) =>
    winston.format.colorize().colorize(
      log.level,
      `[${log.level.toUpperCase()}] ${log.message}`
    ),
  ),

  // Levels.
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    kafka: 4,
    debug: 5,
  },

  // Outputs.
  transports: [
    new winston.transports.Console({
      level: process.env.LOG_LEVEL || 'debug',
    }),
  ],
});

// Colors.
winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'blue',
  http: 'green',
  kafka: 'magenta',
  debug: 'white',
});

export { logger };
