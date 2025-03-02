import express from 'express';
import {UserRegister,UserLogin,UserUpdateProfile} from '../controllers/user-controller.js';
import {validateUser,validateUserUpdate} from '../middleware/user-validation.js';
import {morganMiddleware} from '../middleware/morgan-middleware.js';
import { verifyToken } from '../middleware/auth-middleware.js';
import {allowedTo} from '../middleware/role-access.js'
import { userRoles } from '../utils/user-roles.js';
export const userRouter = express.Router();

userRouter.use(morganMiddleware);
userRouter.use(express.json());


userRouter.post('/register',validateUser, UserRegister);
userRouter.post('/login', UserLogin);


userRouter.patch('/:email',verifyToken,validateUserUpdate, UserUpdateProfile);

