import httpStatusText from '../utils/http-status-text.js';

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({status: httpStatusText.FAIL, message: 'Forbidden: Admins only'});
  }
  next();
};
