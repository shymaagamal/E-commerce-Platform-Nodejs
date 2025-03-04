import Review from '../models/review-model';
import {asyncWrapper} from '../utils/async-wrapper.js';
import httpStatusText from '../utils/http-status-text.js';
import createLogger from '../utils/logger.js';
import { validationResult } from 'express-validator';

const userLogger = createLogger('user-service');



export const createReview = asyncWrapper(async (req, res,next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        userLogger.error('New data doesn\'t follow schema');
        const error = new Error('New data doesn\'t follow schema');
        error.status = 400;
        error.httpStatusText = httpStatusText.FAIL;
        return next(error);
    }
    const review = await Review.create(req.body);
    userLogger.info('New review created successfully');
    res.status(201).json({status: httpStatusText.SUCCESS, data: review});
    }
);

