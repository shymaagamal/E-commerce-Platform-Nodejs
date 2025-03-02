import process from 'node:process';
import express from 'express';
import mongoose from 'mongoose';
import {errorHandler} from './middleware/errorHandler.js';
import {morganMiddleware} from './middleware/morganMiddleware.js';
import bookRouter from './routes/books.routes.js';
import {userRouter} from './routes/users.routes.js';
import httpStatusText from './utils/httpStatusText.js';
import createLogger from './utils/logger.js';
import 'dotenv/config';


// Creates an Express app for building the REST APIs
const app = express();

// For monitoring the server's behavior and debugging issues
const logger = createLogger('main-service');

// A Middleware for parsing incoming JSON request bodies to be converted to JavaScript object accessible in "req.body"
app.use(express.json());

// Defining API Routes Handlers
app.use('/user', userRouter);
app.use('/book', bookRouter);
app.use('/order' , orderRouter);

// Use Middlewares
app.use(errorHandler);
app.use(morganMiddleware);

// Handle requests to undefined routes by returning a 404 JSON response
app.all('*', (req, res) => {
  res.status(404).json({status: httpStatusText.ERROR, message: 'This resource is not found.'});
});

// Start the server
app.listen(process.env.PORT, () => {
  logger.info(`Server is running on port http://localhost:${process.env.PORT} `);
});

// Connect to our MongoDB 
mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    logger.info('Connected to MongoDB');
  })
  .catch((err) => logger.error('Could not connect to MongoDB', err));
