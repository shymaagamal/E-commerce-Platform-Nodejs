import express from 'express';
import {getOrderHistory} from '../controllers/order-controller.js';

const orderRouter = express.Router();

// Orders Routes
// orderRouter.post('/', placeOrder);
orderRouter.get('/', getOrderHistory);
orderRouter.get('/:id', getOrderById);
orderRouter.post('/payment_checkout', getOrderById);

export default orderRouter;
