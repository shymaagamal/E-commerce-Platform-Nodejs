import jwt from 'jsonwebtoken';
import httpStatusText from '../utils/http-status-text.js';
import createLogger from '../utils/logger.js';

const authLogger = createLogger('Auth-service');
export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({status: httpStatusText.FAIL, message: 'Forbidden: Admins only'});
  }
  next();
};

export const verifyToken = (req, res, next) => {
  const token = req.headers.Authorization || req.headers.authorization;
  if (!token) {
    authLogger.error('❌ Unauthorized request: Login required to access this resource.');
    const error = new Error('❌ Unauthorized request: Login required to access this resource.');
    error.status = 400;
    error.httpStatusText = httpStatusText.FAIL;
    return next(error);
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRETE_KEY);
  req.user = decodedToken;
  if (!decodedToken) {
    authLogger.error('❌ Unauthorized login ');
    const error = new Error('❌ Unauthorized login ');
    error.status = 400;
    error.httpStatusText = httpStatusText.FAIL;
    return next(error);
  }
  authLogger.info('✅ Token successfully verified for user.');
  next();
};
