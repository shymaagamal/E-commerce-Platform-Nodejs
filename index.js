import process from 'node:process';

import express from 'express';
import mongoose from 'mongoose';
import {errorHandler} from './middleware/errorHandler.js';
import {morganMiddleware} from './middleware/morganMiddleware.js';
import httpStatusText from './utils/httpStatusText.js';
import createLogger from './utils/logger.js';
import 'dotenv/config';

const app = express();

const logger = createLogger('main-service');
app.use(errorHandler);

app.use(morganMiddleware);

app.all('*', (req, res) => {
  res.status(404).json({status: httpStatusText.ERROR, message: 'This resource is not found'});
});

app.listen(process.env.PORT, () => {
  logger.info(`Server is running on port http://localhost:${process.env.PORT}`);
});

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    logger.info('Connected to MongoDB');
    const collName = mongoose.connection.db.collection('users');
    const users = await collName.find({name: 'Ned Stark'}).toArray();

    logger.info({status: httpStatusText.SUCCESS, data: {users}});
  })
  .catch((err) => logger.error('Could not connect to MongoDB', err));
