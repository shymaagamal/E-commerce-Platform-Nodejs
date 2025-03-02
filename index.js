import process from 'node:process';
import express from 'express';
import mongoose from 'mongoose';
import {errorHandler} from './middleware/error-handler.js';
import {morganMiddleware} from './middleware/morgan-middleware.js';
import {userRouter} from './routes/users-routes.js';
import httpStatusText from './utils/http-status-text.js';
import createLogger from './utils/logger.js';
import 'dotenv/config';

const app = express();

const logger = createLogger('main-service');
app.use(express.json());
app.use('/user', userRouter);

app.use(errorHandler);
app.use(morganMiddleware);


app.all('*', (req, res) => {
  res.status(404).json({status: httpStatusText.ERROR, message: 'This resource is not found'});
});

app.listen(process.env.PORT, () => {
  logger.info(`Server is running on port http://localhost:${process.env.PORT} `);
});

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    logger.info('Connected to MongoDB');
  })
  .catch((err) => logger.error('Could not connect to MongoDB', err));
