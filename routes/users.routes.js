import express from 'express';
import {UserRegister} from '../controllers/user.controller.js';
import {validateUser} from '../middleware/user.validation.js';

export const userRouter = express.Router();
userRouter.use(express.json());
userRouter.post('/register', validateUser, UserRegister);
// userRouter.post('/login', login);
// userRouter.patch('/:id', updateProfile);

