import express from 'express';
import {UserRegister,UserLogin} from '../controllers/user-controller.js';
import {validateUser} from '../middleware/user-validation.js';

export const userRouter = express.Router();
userRouter.use(express.json());
userRouter.post('/register', validateUser, UserRegister);
userRouter.post('/login', UserLogin);
// userRouter.patch('/:id', updateProfile);

