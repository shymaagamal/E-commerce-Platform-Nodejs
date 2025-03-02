import morgan from 'morgan';
import createLogger from '../utils/logger.js';

const morganLogger = createLogger('morgan-service');

export const morganMiddleware = morgan((tokens, req, res) => {
  const logMessage = `${tokens.method(req, res)} ${tokens.url(req, res)} ${tokens.status(req, res)} - ${tokens['response-time'](req, res)} ms`;
  morganLogger.info(logMessage);
  return logMessage;
});
