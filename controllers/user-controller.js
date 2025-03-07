import {validationResult} from 'express-validator';
import mongoose from 'mongoose';
import {UserModel} from '../models/user-model.js';
import {asyncWrapper} from '../utils/async-wrapper.js';
import {checkPassword, generateJWT} from '../utils/auth-utils.js';
import httpStatusText from '../utils/http-status-text.js';
import createLogger from '../utils/logger.js';
import {userRoles} from '../utils/user-roles.js';
import { sendEmail } from '../utils/email-service.js';

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
    userLogger.error('⚠️ Registration error: Email is already in use.');
    const error = new Error('⚠️ Registration error: Email is already in use.');
    error.status = 400;
    error.httpStatusText = httpStatusText.FAIL;
    return next(error);
  }
  const addedUser = await UserModel.create(req.body);
  const token = generateJWT({role: addedUser.role, email: addedUser.email, id: addedUser._id});
  addedUser.token = token;
  const emailRes=await sendEmail(addedUser.email, 'Welcome to our Book store system', 'You have successfully registered to our BookStore! This is just a confirmation email :)  You can now login to our platform and start using our services. Thank you for joining us! Have a great day ahead! :)');
  if(!emailRes.success){
    userLogger.error(`⚠️ Registration error: Email sending failed. ${emailRes.message}`);
    const error = new Error(`⚠️ Registration error: Email sending failed. ${emailRes.message}`);
    error.status = 400;
    error.httpStatusText = httpStatusText.FAIL;
    return next(error);
  }
  userLogger.info('🎉 New user registered successfully.');
  return res.status(200).json({status: httpStatusText.SUCCESS, data: addedUser});
});

// ========================================================================
//        user login
// ==========================================================================
export const UserLogin = asyncWrapper(async (req, res, next) => {
  const loggedinUser = await UserModel.findOne({email: req.body.email});
  if (!loggedinUser) {
    userLogger.error(`❌ Authentication failed: User with email ${req.body.email} not found.`);
    const error = new Error(`❌ Authentication failed: User with email "${req.body.email}" not found.`);
    error.status = 400;
    error.httpStatusText = httpStatusText.FAIL;
    return next(error);
  }
  const matchedPassword = await checkPassword(loggedinUser, req.body.password);
  if (!matchedPassword) {
    userLogger.error('❌ Authentication failed: Incorrect password.');
    const error = new Error('❌ Authentication failed: Incorrect password.');
    error.status = 400;
    error.httpStatusText = httpStatusText.FAIL;
    return next(error);
  }
  const token = generateJWT({role: loggedinUser.role, email: loggedinUser.email, id: loggedinUser._id});
  loggedinUser.token = token;
  userLogger.info('🎉 User login successful.');
  res.status(200).json({status: httpStatusText.SUCCESS, data: loggedinUser});
});

// ========================================================================
//                        user Update Profile
// ==========================================================================

export const UserUpdateProfile = asyncWrapper(async (req, res, next) => {
  const email = req.params.email;
  const dataToUpdate = req.body;
  if (dataToUpdate.role && req.user.role !== userRoles.ADMIN) {
    userLogger.error(`❌ Unauthorized role update attempt by ${req.user.email}`);
    const error = new Error('❌ You are not allowed to change roles.');
    error.status = 400;
    error.httpStatusText = httpStatusText.ERROR;
    return next(error);
  }
  const isUserExist = await UserModel.findOneAndUpdate({email}, {$set: dataToUpdate}, {new: true, runValidators: true});
  if (!isUserExist) {
    userLogger.error(`❌ User not found: "${email}"`);
    const error = new Error('❌ User does not exist.');
    error.status = 400;
    error.httpStatusText = httpStatusText.FAIL;
    return next(error);
  }
  userLogger.info(`📝 User "${email}" updated successfully by "${req.user.email}"`);
  res.status(200).json({status: httpStatusText.SUCCESS, data: isUserExist});
});

// ========================================================================
//                        user logout
// ==========================================================================

export const UserLogOut = asyncWrapper(async (req, res, next) => {
  if (req.user.id !== req.session.userID) {
    const sessionCollection = mongoose.connection.collection('sessions');
    const sessionDoc = await sessionCollection.deleteOne({session: {$regex: `"userID":"${req.user.id}"`}});
    console.log(sessionDoc);
    if (!sessionDoc) {
      userLogger.error('❌ logged-in user doesnt have data');
      const error = new Error('❌ logged-in user doesnt have data');
      error.status = 400;
      error.httpStatusText = httpStatusText.FAIL;
      return next(error);
    }
    userLogger.info(`✅ User [ID: ${req.user.id}] logged out successfully. Session destroyed from dataBase at ${new Date().toISOString()}`);
    res.status(200).json({status: httpStatusText.SUCCESS, message: `✅ User [ID: ${req.user.id}] logged out successfully. Session destroyed from dataBase at ${new Date().toISOString()}`});
  }
  req.session.userID = req.user.id;
  req.session.destroy();
  userLogger.info(`✅ User [ID: ${req.user.id}] logged out successfully. Session destroyed at ${new Date().toISOString()}`);
  res.status(200).json({status: httpStatusText.SUCCESS, message: `✅ User [ID: ${req.user.id}] logged out successfully. Session destroyed at ${new Date().toISOString()}`});
});
