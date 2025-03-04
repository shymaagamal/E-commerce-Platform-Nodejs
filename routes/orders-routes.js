import express from 'express';
import {getOrderById, getOrdersHistory} from '../controllers/order-controller.js';
import {verifyToken} from '../middleware/auth-middleware.js';
import {morganMiddleware} from '../middleware/morgan-middleware.js';
// import { orderPayment } from "../controllers/paymentController.js";


const orderRouter = express.Router();
orderRouter.use(morganMiddleware);

// Orders Routes
orderRouter.get('/', verifyToken, getOrdersHistory);
orderRouter.get('/:id', verifyToken, getOrderById);

orderRouter.get('/cancel/:id', verifyToken , );

// Order Payment Checkout Route
// orderRouter.post('/payment/:id', verifyToken , orderPayment);

export default orderRouter;
