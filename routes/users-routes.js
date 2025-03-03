import express from 'express';
import {UserLogin, UserRegister, UserUpdateProfile} from '../controllers/user-controller.js';
import {verifyToken} from '../middleware/auth-middleware.js';
import {morganMiddleware} from '../middleware/morgan-middleware.js';
import {validateUser, validateUserUpdate} from '../middleware/user-validation.js';

export const userRouter = express.Router();

userRouter.use(morganMiddleware);
userRouter.use(express.json());

userRouter.post('/register', validateUser, UserRegister);
userRouter.post('/login', UserLogin);
// userRouter.post('/logout', UserLogOut);

userRouter.patch('/:email', verifyToken, validateUserUpdate, UserUpdateProfile);
