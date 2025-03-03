import Order from "../models/order-model.js"
import {asyncWrapper} from "../utils/async-wrapper.js";
import httpStatusText from "../utils/http-status-text.js";
import createLogger from "../utils/logger.js";

const orderLogger = createLogger('user-service');

// Store either the success or error message
let msg = "" ;

/***************************** Get/View All Orders History For the logged-in user *****************************/

export const getOrderHistory = asyncWrapper ( async (req, res , next) => {

    // Fetch orders related to the user and populate/fetch book details for more readability
    const orders = await Order.find() .populate({
        path: "books.bookId",
        select: "title price" // Fetch only title and price from Book collection
    }) .sort({ createdAt: -1 }); // Sort by most recent orders
 

    // If no orders found
    if (!orders.length) 
    {
        msg = "No orders history found for this user." ;
        orderLogger.error(msg) ;
        return res.status(404).json({ success: httpStatusText.FAIL, message: msg });
    }

    msg = "Order history is retrieved successfully." ; 
    orderLogger.info(msg) ;
    // Return orders
    return res.status(200).json({ success: httpStatusText.SUCCESS, message: msg, formattedOrders });
});

/***************************** Different Ids Clarification found in the returned response from "getOrderHistory" function
Sample Output : 

    "success": "success",
    "message": "Order history is retrieved successfully.",
    "orders": [
        {
            "_id": "67c4984d6cd9d8ce879a2ade",  ---> OrderId
            "userId": "67c437bdcf712dcb576a083f",  ---> UserId
            "books": [
                {
                    "_id": "67c5df2c67aed148cca1b4dc",  ---> Object Entry ID for thie book object ( so wil remove it from output )
                    "bookId": {
                        "_id": "67c476526cd9d8ce879a21c0",  ---> BookId
                        "title": "Design Patterns",
                        "price": 45.99
                    },
                    "quantity": 1
                }],
            ...
        }]
********************************************************************************************************************/