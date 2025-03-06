import process from 'node:process';
import Stripe from 'stripe';
import Order from '../models/order-model.js';
import {UserModel} from '../models/user-model.js';
import {asyncWrapper} from '../utils/async-wrapper.js';
import {getCache, setCache} from '../utils/cache-service.js';
import httpStatusText from '../utils/http-status-text.js';
import createLogger from '../utils/logger.js';

import 'dotenv/config';

const orderLogger = createLogger('order-service');

// Store either the success or error message
let msg = '';

/** *************************** Get/View All Orders History For the logged-in user */

export const getOrdersHistory = asyncWrapper (async (req, res, next) => {
  // Extract the logged-in user's ID
  const userId = req.user.id;
  const cachedOrders = getCache('orders');
  if (cachedOrders) {
    orderLogger.info(`✅ Cache HIT: Retrieved ${cachedOrders.length} orders from Node cache 🏷️ at ${new Date().toISOString()}`);
    return res.status(200).json({status: httpStatusText.SUCCESS, cachedOrders});
  }
  orderLogger.warn(`⚠️ Cache MISS: Fetching orders from the database 🗄️ at ${new Date().toISOString()}`);

  // Fetch orders related to the user and populate/fetch book details for more readability
  const orders = await Order.find({userId}).populate({
    path: 'books.bookId',
    select: 'title price' // Fetch only title and price from Book collection
  }).sort({createdAt: -1}); // Sort by most recent orders ( Descending )

  // If order not found
  if (!orders) {
    msg = 'No orders history found for this user';
    orderLogger.error(msg);
    return res.status(404).json({status: httpStatusText.FAIL, message: msg});
  }

  msg = '✅ Full Orders history is retrieved successfully.';
  orderLogger.info(msg);
  orderLogger.info(`📚 Cache SET: Stored ${orders.length} books in cache ⏳ TTL=${3600}s 🕒 at ${new Date().toISOString()}`);

  setCache('orders', orders);
  // Return orders
  return res.status(200).json({status: httpStatusText.SUCCESS, message: msg, orders});
});

/**
 ******** Different Ids Clarification found in the returned response from "getOrderHistory" function
Sample Output :

    "success": "success",
    "message": "Order history is retrieved successfully.",
    "orders": [
        {
            "_id": "67c4984d6cd9d8ce879a2ade",  ---> OrderId
            "userId": "67c437bdcf712dcb576a083f",  ---> UserId
            "books": [
                {
                    "_id": "67c5df2c67aed148cca1b4dc",  ---> Object Entry ID for thie book object
                    "bookId": {
                        "_id": "67c476526cd9d8ce879a21c0",  ---> BookId
                        "title": "Design Patterns",
                        "price": 45.99
                    },
                    "quantity": 1
                }],
            ...
        }]

 *********
 */

/** ***************** Helper function to validate order id existence and the logged in user ownership status to this order */
const orderValidation = async (req, res, next) => {
  // Extract the logged-in user's ID
  const UserId = req.user.id;

  // Get orderId from request parameters
  const orderId = req.params.id;

  // Find the order by ID and populate book details
  const order = await Order.findById({_id: orderId}).populate({
    path: 'books.bookId', // Populate the bookId field inside books array
    select: 'title price' // Select only title and price from the Book model
  });

  // If order not found
  if (!order) {
    msg = 'Order not found for this user.';
    orderLogger.error(msg);
    return res.status(404).json({status: httpStatusText.FAIL, message: msg});
  }

  // If order retrieved isn't owned/placed by the same user logged in
  if (order.userId.toString() != UserId) {
    msg = 'You aren\'t authorized to view this order as it isn\'t yours.';
    orderLogger.error(msg);
    return res.status(404).json({status: httpStatusText.FAIL, message: msg});
  }

  return order;
};

/** *************************** Get/View Order History By ID For the logged-in user */

export const getOrderById = asyncWrapper(async (req, res, next) => {
  const order = await orderValidation(req, res, next);
  msg = '✅ Order is retrieved successfully.';
  orderLogger.info(msg);
  return res.status(200).json({status: httpStatusText.SUCCESS, message: msg, order});
});

/** *************************** Order Cancellation by User ( only in case of before payment ) */

export const cancelOrder = asyncWrapper(async (req, res, next) => {
  const order = await orderValidation(req, res, next);

  // Check if order is eligible for cancellation
  if (order.status === 'completed') {
    if (order.paymentIntentId) {
      const refund = await stripe.refunds.create({
        payment_intent: order.paymentIntentId
      });

      order.status = 'canceled';
      await order.save();
      msg = '✅ The refund process is completed  & the order is canceled successfully.';
      return res.status(200).json({status: httpStatusText.SUCCESS, message: msg, refund});
    }

    msg = 'Payment not found for this order to refund.';
    order.status = 'canceled';
    await order.save();
    orderLogger.error(msg);
    return res.status(400).json({status: httpStatusText.FAIL, message: msg});
  }

  if (order.status === 'canceled') {
    msg = 'Order is already canceled.';
    orderLogger.error(msg);
    return res.status(400).json({status: httpStatusText.FAIL, message: msg});
  }

  order.status = 'canceled';
  await order.save();

  msg = '✅ Order is canceled successfully.';
  orderLogger.info(msg);
  return res.status(200).json({status: httpStatusText.SUCCESS, message: msg, order});
});

/** *************************** Order Chechout/Payment using Stripe ( online payment method ) */

// Using Stripe SDK ( Software Development Kit ) & initializing it using my fixed secret key ( required to authenticate requests to Stripe )
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const orderPayment = asyncWrapper(async (req, res, next) => {
  const userId = req.user.id;
  // Fetch user details
  const user = await UserModel.findById(userId);

  const order = await orderValidation(req, res, next);

  // Convert to cents ( smallest unit )
  const totalAmount = order.totalPrice * 100;

  // Create a Stripe payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount,
    currency: 'usd',
    payment_method_types: ['card'],
    payment_method: 'pm_card_visa',
    confirm: true, // Auto-confirm the payment
    metadata: {orderId: order._id.toString(), userId: user._id.toString()}
  });

  order.paymentIntentId = paymentIntent.id;
  await order.save();
  orderLogger.info('✅ The Payment Intent Id is stored successfully in this order.');

  // Update order status based on payment outcome
  if (paymentIntent.status === 'succeeded') {
    if (order.status === 'completed') {
      paymentIntent.confirm = false;
      msg = 'You already paid for this order before.';
      orderLogger.error(msg);
      return res.status(400).json({status: httpStatusText.FAIL, message: msg});
    }

    order.status = 'completed';
    await order.save();
    msg = '✅ Payment successful, order completed!';
    orderLogger.info(msg);
    return res.status(200).json({status: httpStatusText.SUCCESS, message: msg, order});
  }

  order.status = 'pending';
  await order.save();
  msg = 'Payment failed. Please try again.';
  orderLogger.error(msg);
  return res.status(400).json({status: httpStatusText.FAIL, message: msg});
});
