import express from 'express';
import {getOrdersHistory , getOrderById } from '../controllers/order-controller.js';
import { verifyToken } from '../middleware/auth-middleware.js';

const orderRouter = express.Router();

// Orders Routes
orderRouter.get('/', verifyToken , getOrdersHistory);
orderRouter.get('/:id', verifyToken , getOrderById);

export default orderRouter;
