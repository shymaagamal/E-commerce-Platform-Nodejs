import httpStatusText from '../utils/httpStatusText.js';
import logger from '../utils/logger.js';

export const errorHandler = (error, req, res, next) => {
  logger.error(error.stack);
  res.status(error.status || 500).json({status: httpStatusText.ERROR, message: error.message || 'Internal Server Error'});
};
