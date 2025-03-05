import express from 'express';
import {verifyToken} from '../middleware/auth-middleware.js';
import {morganMiddleware} from '../middleware/morgan-middleware.js';
import {getOrdersHistory , getOrderById , cancelOrder , orderPayment } from '../controllers/order-controller.js';


const orderRouter = express.Router();

// An HTTP request logger middleware to track incoming requests
orderRouter.use(morganMiddleware);

// Orders Routes
orderRouter.get('/', verifyToken, getOrdersHistory);
orderRouter.get('/:id', verifyToken, getOrderById);

// The only case that user can change his/her order status and cancel it is before payment
// Get the order details after changing its status ( if eligible )
orderRouter.get('/cancel/:id', verifyToken , cancelOrder);

orderRouter.post('/payment/:id', verifyToken , orderPayment);


export default orderRouter;