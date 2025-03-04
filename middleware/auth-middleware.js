import process from 'node:process';
import jwt from 'jsonwebtoken';
import {asyncWrapper} from '../utils/async-wrapper.js';
import httpStatusText from '../utils/http-status-text.js';
import createLogger from '../utils/logger.js';

const authLogger = createLogger('Auth-service');
export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({status: httpStatusText.FAIL, message: 'Forbidden: Admins only'});
  }
  next();
};


// jwt.verify is sync fun so i cant wrap it using asynWrapper ,so i catch error using try-catch then passed error to errorHandler middleware

export const verifyToken = (req, res, next) => {
  const token = req.headers.Authorization || req.headers.authorization;
  if (!token) {
    authLogger.error('❌ Unauthorized request: Login required to access this resource.');
    const error = new Error('❌ Unauthorized request: Login required to access this resource.');
    error.status = 400;
    error.httpStatusText = httpStatusText.FAIL;
    return next(error);
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRETE_KEY);
    req.user = decodedToken;
    next();
  } catch (err) {
    authLogger.error('❌ Unauthorized login ');
    err.message = '❌ Unauthorized login ';
    err.status = 400;
    err.httpStatusText = httpStatusText.FAIL;
    next(err);
  }
};