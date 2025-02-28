import process from 'node:process';

import express from 'express';
import mongoose from 'mongoose';
import {errorHandler} from './middleware/errorHandler.js';
import httpStatusText from './utils/httpStatusText.js';

import 'dotenv/config';

const app = express();

app.all('*', (req, res) => {
  res.status(404).json({status: httpStatusText.ERROR, message: 'This resource is not found'});
});
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log('Connected to MongoDB');
    const collName = mongoose.connection.db.collection('users');
    const users = await collName.find({}).toArray();

    console.log('Users:', users);
  })
  .catch((err) => console.error('Could not connect to MongoDB', err));
