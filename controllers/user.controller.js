import {validationResult} from 'express-validator';
import {asyncWrapper} from '../middleware/asyncWrapper.js';
import {UserModel} from '../models/user.model.js';
import httpStatusText from '../utils/httpStatusText.js';
import createLogger from '../utils/logger.js';

const userLogger = createLogger('user-service');

export const UserRegister = asyncWrapper(async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    userLogger.error('New data doesn\'t follow schema');
    return res.status(400).json({status: httpStatusText.FAIL, data: error});
  }
  const checkEmail = await UserModel.findOne({email: req.body.email});
  if (checkEmail) {
    userLogger.error('Email already exists');
    const error = new Error('Email already exists');
    error.status = 400;
    error.httpStatusText = httpStatusText.FAIL;
    return next(error);
  }
  const addedUser = await UserModel.create(req.body);
  userLogger.info('User added successfully');
  return res.status(200).json({status: httpStatusText.SUCCESS, data: addedUser});
});
