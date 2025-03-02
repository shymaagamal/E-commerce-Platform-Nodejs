import express from 'express';
import {UserRegister,UserLogin} from '../controllers/user-controller.js';
import {validateUser} from '../middleware/user-validation.js';
import {morganMiddleware} from '../middleware/morgan-middleware.js';
import { verifyToken } from '../middleware/auth-middleware.js';

export const userRouter = express.Router();

userRouter.use(express.json());
userRouter.use(morganMiddleware);
userRouter.post('/register', validateUser, UserRegister);
userRouter.post('/login', UserLogin);
// userRouter.patch('/:id', updateProfile);

