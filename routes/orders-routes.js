import express from 'express';
import {getOrdersHistory , getOrderById } from '../controllers/order-controller.js';
import { verifyToken } from '../middleware/auth-middleware.js';

const orderRouter = express.Router();

// Orders Routes
// orderRouter.post('/', placeOrder);
orderRouter.get('/', verifyToken , getOrdersHistory);
orderRouter.get('/', verifyToken , getOrderById);

export default orderRouter;
