import httpStatusText from '../utils/http-status-text.js';
import jwt from 'jsonwebtoken';

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({status: httpStatusText.FAIL, message: 'Forbidden: Admins only'});
  }
  next();
};


export const verifyToken = (req, res, next) => {

    const token = req.headers.Authorization || req.headers.authorization;
    if (!token) {
      const error = new Error('you have to login');
      error.status = 400;
      error.httpStatusText=httpStatusText.FAIL;
      return next(error);
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRETE_KEY);
    req.user = decodedToken;
    if (!decodedToken) {
      const error = new Error('invalid login');
      error.status = 400;
      error.httpStatusText=httpStatusText.FAIL;
      return next(error);
    }
    next()

};