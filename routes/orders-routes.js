import express from 'express';
import {getOrderById, getOrdersHistory} from '../controllers/order-controller.js';
import {verifyToken} from '../middleware/auth-middleware.js';
import {morganMiddleware} from '../middleware/morgan-middleware.js';

const orderRouter = express.Router();
orderRouter.use(morganMiddleware);

// Orders Routes
orderRouter.get('/', verifyToken, getOrdersHistory);
orderRouter.get('/:id', verifyToken, getOrderById);

export default orderRouter;
