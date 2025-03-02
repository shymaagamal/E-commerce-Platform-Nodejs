import httpStatusText from '../utils/httpStatusText.js';

export const errorHandler = (error, req, res, next) => {
  res.status(error.status || 500).json({status: error.httpStatusText || httpStatusText.ERROR, message: error.message || 'Internal Server Error'});
};
