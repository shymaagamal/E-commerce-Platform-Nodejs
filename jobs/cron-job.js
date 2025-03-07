import cron from "cron";
import Order from "../models/order-model.js"; 
import { asyncWrapper } from '../utils/async-wrapper.js';
import createLogger from '../utils/logger.js';

const orderLogger = createLogger('order-service');


/************* A Job to delete all orders with status "canceled" which passed the 3 days with same status without change *************/
const deleteOldCancelledOrders = async () => {
    try 
    {
        // Convert `createdAt` from string to Date first
        await Order.updateMany(
            { createdAt: { $type: "string" } }, 
            [{ $set: { createdAt: { $toDate: "$createdAt" } } }]
        );

        // Define the cutoff date for deletion
        const oneDayAgo = new Date();
        oneDayAgo.setHours(oneDayAgo.getHours() - 24);  // Move exactly 24 hours back

        // Now delete orders older than one day
        const result = await Order.deleteMany({
            status: "cancelled",
            createdAt: { $lte: oneDayAgo }
        });
     

        if (result.deletedCount > 0) 
        {
            orderLogger.info(`🗑️  Deleted ${result.deletedCount} cancelled orders.`);
        } 
        else 
        {
            orderLogger.info("No cancelled orders to be deleted.");
        }
    } 
    catch (error) 
    {
        orderLogger.error(`❌ Error deleting old cancelled orders : ${error.message}`);
    }
};

// Run job immediately when the project starts
deleteOldCancelledOrders();

// Schedule the job to run daily at midnight
const deleteOldCancelledOrdersJob = new cron.CronJob(
    "0 0 * * *", // Runs every day at midnight
    asyncWrapper(deleteOldCancelledOrders)
);

// Start the cron job
deleteOldCancelledOrdersJob.start();
orderLogger.info("✅ Scheduled job to delete old cancelled orders is running...");

export default deleteOldCancelledOrdersJob;