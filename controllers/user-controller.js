import {validationResult} from 'express-validator';
import {asyncWrapper} from '../middleware/asyncWrapper.js';
import {UserModel} from '../models/user.model.js';
import {generateJWT} from '../utils/authentication.js';
import httpStatusText from '../utils/http-status-text.js';
import createLogger from '../utils/logger.js';

const userLogger = createLogger('user-service');


// ========================================================================
//        user register
// ==========================================================================
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
  const  token = generateJWT({role: addedUser.role ,email: addedUser.email,id :addedUser._id})
  addedUser.token=token;
  userLogger.info('User added successfully');
  return res.status(200).json({status: httpStatusText.SUCCESS, data: addedUser});
});




// ========================================================================
//        user login
// ==========================================================================
export const UserLogin=asyncWrapper(async (req, res, next) => {
  


})

