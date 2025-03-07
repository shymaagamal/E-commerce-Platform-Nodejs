import process from 'node:process';
import cookieParser from 'cookie-parser';
import express from 'express';
import mongoose from 'mongoose';
import {errorHandler} from './middleware/error-handler.js';
import {morganMiddleware} from './middleware/morgan-middleware.js';
import sessionMiddleware from './middleware/session-middleware.js';
import bookRouter from './routes/books-routes.js';
import cartRouter from './routes/carts-routes.js';
import orderRouter from './routes/orders-routes.js';
import reviewRouter from './routes/reviews-routes.js';
import {userRouter} from './routes/users-routes.js';
import httpStatusText from './utils/http-status-text.js';
import createLogger from './utils/logger.js';
import 'dotenv/config';

// Creates an Express app for building the REST APIs
const app = express();
// For monitoring the server's behavior and debugging issues
const logger = createLogger('main-service');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
// A Middleware for parsing incoming JSON request bodies to be converted to JavaScript object accessible in "req.body"
app.use(sessionMiddleware);
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));

// Defining API Routes Handlers
app.use('/user', userRouter);
app.use('/book', bookRouter);
app.use('/order', orderRouter);
app.use('/cart', cartRouter);
app.use('/review', reviewRouter);

// Use Middlewares
app.use(errorHandler);
app.use(morganMiddleware);

// Handle requests to undefined routes by returning a 404 JSON response
app.all('*', (req, res) => {
  logger.error(`❌ 404 | Resource not found: ${req.method} ${req.originalUrl}`);

  res.status(404).json({status: httpStatusText.ERROR, message: 'This resource is not found.'});
});

// Start the server
app.listen(process.env.PORT, () => {
  logger.info(`🚀 Server is running at: http://localhost:${process.env.PORT}`);
});

// Connect to our MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    logger.info('✅ Successfully connected to MongoDB.');
  })
  .catch((err) => logger.error(`❌ Failed to connect to MongoDB: ${err.message}`));
