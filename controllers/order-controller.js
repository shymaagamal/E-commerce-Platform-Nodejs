import Order from '../models/order-model.js';
import {asyncWrapper} from '../utils/async-wrapper.js';
import httpStatusText from '../utils/http-status-text.js';
import createLogger from '../utils/logger.js';

const orderLogger = createLogger('order-service');

// Store either the success or error message
let msg = '';

/** *************************** Get/View All Orders History For the logged-in user */

export const getOrdersHistory = asyncWrapper (async (req, res, next) => {
  // Extract the logged-in user's ID
  const userId = req.user.id;

  // Fetch orders related to the user and populate/fetch book details for more readability
  const orders = await Order.find({userId}).populate({
    path: 'books.bookId',
    select: 'title price' // Fetch only title and price from Book collection
  }).sort({createdAt: -1}); // Sort by most recent orders ( Descending )

  msg = 'Full Orders history is retrieved successfully.';
  orderLogger.info(msg);
  // Return orders
  return res.status(200).json({status: httpStatusText.SUCCESS, message: msg, orders});
});

/**
 ***** Different Ids Clarification found in the returned response from "getOrderHistory" function
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
 ******
 */

/** *************************** Get/View Order History By ID For the logged-in user */

export const getOrderById = asyncWrapper(async (req, res, next) => {
  // Extract the logged-in user's ID
  const UserId = req.user.id;

  // Get orderId from request parameters
  const orderId = req.params.id;

  // Find the order by ID and populate book details
  const order = await Order.findById({_id: orderId}).populate({
    path: 'books.bookId',
    select: 'title price' // Fetch only title and price from Book collection
  });

  // If order retrieved isn't owned/placed by the same user logged in
  if (order.userId != UserId) {
    msg = 'You aren\'t authorized to view this order as it isn\'t yours.';
    orderLogger.error(msg);
    return res.status(404).json({status: httpStatusText.FAIL, message: msg});
  }

  // If order not found
  if (!order) {
    msg = 'Order not found for this user.';
    orderLogger.error(msg);
    return res.status(404).json({status: httpStatusText.FAIL, message: msg});
  }

  msg = 'Order is retrieved successfully.';
  orderLogger.info(msg);
  return res.status(200).json({status: httpStatusText.SUCCESS, message: msg, order});
});
