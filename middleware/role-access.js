import httpStatusText from '../utils/http-status-text.js';
import createLogger from '../utils/logger.js';

const roleLogger = createLogger('role-service');

export const allowedTo = (...roles) => {
  return (req, res, next) => {
    const isInclude = roles.includes(req.user.role);
    if (!isInclude) {
      roleLogger.error(`⚠️ Unauthorized attempt by role "${req.user.role}" to access ${req.originalUrl}`);
      const error = new Error(`Unauthorized attempt by role "${req.user.role}`);
      error.status = 404;
      error.httpStatusText = httpStatusText.ERROR;
      return next(error);
    }
    roleLogger.info(`✅ Authorized Access: Role "${req.user.role}" accessed ${req.originalUrl}`);
    next();
  };
};
