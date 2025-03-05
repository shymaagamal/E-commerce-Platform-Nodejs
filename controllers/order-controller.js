import Stripe from "stripe";
import Order from '../models/order-model.js';
import {UserModel} from '../models/user-model.js'; 
import {asyncWrapper} from '../utils/async-wrapper.js';
import httpStatusText from '../utils/http-status-text.js';
import createLogger from '../utils/logger.js';
import 'dotenv/config';
import process from 'process' ;


const orderLogger = createLogger('order-service');

// Store either the success or error message
let msg = '';


/***************************** Place/Add an Order *****************************/

// The user will only be able to write the books list with their quantities 
// As Status , Total Price will be handled automatically by the platform system
export const placeOrder = asyncWrapper( async (req, res , next) => {

    // Check if the request body contains either 'status' or 'totalPrice' field as it is being intialized automatically by the user
    if ('status' in req.body) 
    {
        msg = "You cannot initialize the status of the order. It is handled automatically by the system." ;
        orderLogger.error(msg)
        return res.status(400).json({ status: httpStatusText.FAIL, message: msg});
    }
    if ('totalPrice' in req.body) 
    {
        msg = "You don't have to enter the order total price ( to prevent incorrect data ) as it is been automatically calculated by the system." ;
        orderLogger.error(msg)
        return res.status(400).json({ status: httpStatusText.FAIL, message: msg });
    }
    if ('paymentIntentId' in req.body) 
    {
        msg = "Accessing the paymentintend Id is Restricted." ;
        orderLogger.error(msg)
        return res.status(400).json({ status: httpStatusText.FAIL, message: msg });
    }

    const { userId, books} = req.body;

    // Ensure books is correctly formatted as an array of objects
    if (!Array.isArray(books) || books.some(book => !book.bookId || !book.quantity)) 
    {
        msg = "Invalid books format. Each book must have bookId and quantity." ;
        orderLogger.error(msg)
        return res.status(400).json({ status: httpStatusText.FAIL, message: msg });
    }

    // Fetch bookIds from books array in the Order collection
    const booksIds = books.map(book => book.bookId);
    // MongoDB Query to fetch all books from the Book database that match those bookIds in Order collection
    const bookRecords = await bookModel.find({ _id: { $in: booksIds } });

    // Ensure all bookIds exist in the database
    if (bookRecords.length !== books.length) 
    {
        msg = "One or more books are invalid or not found." ;
        orderLogger.error(msg)
        return res.status(400).json({ status: httpStatusText.FAIL,message: msg});
    }

    // Calculate order total price
    let totalPrice = 0;
    books.forEach(book => {
        const bookData = bookRecords.find(b => b._id.toString() === book.bookId);
        if (bookData) 
        {
            totalPrice += bookData.price * book.quantity;
        }
    });

    // Create the order
    const order = new Order({ userId, books,
        totalPrice,  // Auto-calculated
        status: "pending" // Auto-updated
    });

    await order.save();
    msg = "Order is placed successfully!" ;
    orderLogger.info(msg)
    res.status(200).json({ status: httpStatusText.SUCCESS, message: msg}); 
});



/***************************** Get/View All Orders History For the logged-in user *****************************/

export const getOrdersHistory = asyncWrapper ( async (req, res , next) => {
 
    // Extract the logged-in user's ID
    const userId = req.user.id; 

    // Fetch orders related to the user and populate/fetch book details for more readability
    const orders = await Order.find( {userId}) .populate({
        path: "books.bookId",
        select: "title price" // Fetch only title and price from Book collection
    }) .sort({ createdAt: -1 }); // Sort by most recent orders ( Descending )
 

    // If order not found
    if (orders.length == 0) 
    {
        msg = "No orders history found for this user" ;
        orderLogger.error(msg) ;
        return res.status(404).json({ status: httpStatusText.FAIL, message: msg });
    }

    msg = "✅ Full Orders history is retrieved successfully.";
    orderLogger.info(msg);
    // Return orders
    return res.status(200).json({status: httpStatusText.SUCCESS, message: msg, orders});
});

/********** Different Ids Clarification found in the returned response from "getOrderHistory" function
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

**********/



/******************* Helper function to validate order id existence and the logged in user ownership status to this order *******************/
const orderValidation = async (req, res, next ) => {
    
    // Extract the logged-in user's ID
    const UserId = req.user.id

    // Get orderId from request parameters
    const orderId = req.params.id ;

    // Find the order by ID and populate book details
    const order = await Order.findById({ _id: orderId}).populate({
        path: "books.bookId", // Populate the bookId field inside books array
    select: "title price" // Select only title and price from the Book model
    })

    // If order not found
    if (!order) 
    {
        msg = "Order not found for this user." ;
        orderLogger.error(msg) ;
        return res.status(404).json({ status: httpStatusText.FAIL, message: msg });
    }

    // If order retrieved isn't owned/placed by the same user logged in 
    if ( order.userId.toString() != UserId )
    {
        msg = "You aren't authorized to view this order as it isn't yours." ;
        orderLogger.error(msg) ;
        return res.status(404).json({ status: httpStatusText.FAIL, message: msg });
    }

    return order ;
};



/***************************** Get/View Order History By ID For the logged-in user *****************************/

export const getOrderById = asyncWrapper(async (req, res, next) => {
    const order = await orderValidation(req , res , next) ;
    msg = "✅ Order is retrieved successfully.";
    orderLogger.info(msg);
    return res.status(200).json({status: httpStatusText.SUCCESS, message: msg, order});
});



/***************************** Order Cancellation by User ( only in case of before payment ) *****************************/

export const cancelOrder = asyncWrapper(async (req, res, next) => {

    const order = await orderValidation(req , res , next) ;

    // Check if order is eligible for cancellation
    if (order.status == "completed") 
    {
        if ( order.paymentIntentId )
        {
            const refund = await stripe.refunds.create({
                payment_intent: order.paymentIntentId
            });
    
            order.status = "canceled";
            await order.save();
            msg = "✅ The refund process is completed  & the order is canceled successfully.";
            return res.status(200).json({ status: httpStatusText.SUCCESS, message: msg , refund});
        }

        msg = "Payment not found for this order to refund.";
        order.status = "canceled";
        await order.save();
        orderLogger.error(msg);
        return res.status(400).json({ status: httpStatusText.FAIL, message: msg });
    }
    
    if ( order.status == "canceled")
    {
        msg = "Order is already canceled.";
        orderLogger.error(msg);
        return res.status(400).json({ status: httpStatusText.FAIL, message: msg });
    }

    order.status = "canceled";
    await order.save();

    msg = "✅ Order is canceled successfully.";
    orderLogger.info(msg);
    return res.status(200).json({ status: httpStatusText.SUCCESS, message: msg , order});
});



/***************************** Order Chechout/Payment using Stripe ( online payment method ) *****************************/

// Using Stripe SDK ( Software Development Kit ) & initializing it using my fixed secret key ( required to authenticate requests to Stripe ) 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const orderPayment = asyncWrapper(async (req, res, next) => {

    const userId = req.user.id;
    // Fetch user details
    const user = await UserModel.findById(userId);

    const order = await orderValidation(req , res , next) ;

    // Convert to cents ( smallest unit )
    const totalAmount = order.totalPrice * 100; 

    // Create a Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency: "usd",
        payment_method_types: ["card"],
        payment_method: "pm_card_visa",
        confirm: true,   // Auto-confirm the payment
        metadata: { orderId: order._id.toString(), userId: user._id.toString() }
    });

    order.paymentIntentId = paymentIntent.id ;
    await order.save();
    orderLogger.info("✅ The Payment Intent Id is stored successfully in this order.") ;

    // Update order status based on payment outcome
    if (paymentIntent.status === "succeeded") 
    {
        if ( order.status == "completed")
        {
            paymentIntent.confirm = false ;
            msg = "You already paid for this order before." ;
            orderLogger.error(msg) ;
            return res.status(400).json({ status: httpStatusText.FAIL, message: msg });
        }

        order.status = "completed";
        await order.save();
        msg = "✅ Payment successful, order completed!" ;
        orderLogger.info(msg) ;
        return res.status(200).json({ status: httpStatusText.SUCCESS, message: msg , order });
    }

    order.status = "pending";
    await order.save();
    msg = "Payment failed. Please try again." ;
    orderLogger.error(msg) ;
    return res.status(400).json({ status: httpStatusText.FAIL, message: msg });
});