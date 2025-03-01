import winston from 'winston';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
  winston.format.printf(({timestamp, level, message}) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

// Logger Factory Function
const createLogger = (serviceName) => {
  return winston.createLogger({
    level: 'info',
    format: logFormat,
    defaultMeta: {service: serviceName},
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), logFormat)
      }),
      new winston.transports.File({filename: `logs/${serviceName}-combined.log`}),
      new winston.transports.File({filename: `logs/${serviceName}-error.log`, level: 'error'})

    ]
  });
};

export default createLogger;
