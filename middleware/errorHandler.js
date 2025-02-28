import httpStatusText from '../utils/httpStatusText.js';

export const errorHandler = (error, req, res, next) => {
  console.error(error.stack);
  res.status(error.status || 500).json({status: httpStatusText.ERROR, message: error.message || 'Internal Server Error'}); 
};
