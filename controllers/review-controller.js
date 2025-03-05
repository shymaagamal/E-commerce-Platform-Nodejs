import Review from '../models/review-model.js';
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
    req.body.user = req.user.id;
    const review = await Review.create(req.body);
    userLogger.info('New review created successfully');
    res.status(201).json({status: httpStatusText.SUCCESS, data: review});
    }
);

export const updateReview = asyncWrapper(async (req, res,next) => {  
    const review= await Review.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
    if (!review) {
        userLogger.error(`Review with id ${req.params.id} not found`);
        const error = new Error(`Review with id ${req.params.id} not found`);
        error.status = 404;
        error.httpStatusText = httpStatusText.FAIL;
        return next(error);
    }
    userLogger.info(`Review with id ${req.params.id} updated`);
    res.json({status: httpStatusText.SUCCESS, data: review});
    }
);

export const deleteReview = asyncWrapper(async (req, res,next) => { 
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
        userLogger.error(`Review with id ${req.params.id} not found`);
        const error = new Error(`Review with id ${req.params.id} not found`);
        error.status = 404;
        error.httpStatusText = httpStatusText.FAIL;
        return next(error);
    }
    userLogger.info(`Review with id ${req.params.id} deleted`);
    res.json({status: httpStatusText.SUCCESS, data: null});
    }
);

export const getReviews = asyncWrapper(async (req, res, next) => {
    const { bookId } = req.params; 
    const reviews = await Review.find({ book: bookId }).populate('user', 'name').populate('book', 'title'); 
  
    if (!reviews.length) {
      userLogger.error(`No reviews found for book with id ${bookId}`);
      const error = new Error(`No reviews found for book with id ${bookId}`);
      error.status = 404; 
      error.httpStatusText = httpStatusText.FAIL;
      return next(error);
    }
  
    userLogger.info(`Reviews for book with id ${bookId} fetched`);
    res.json({ status: httpStatusText.SUCCESS, data: reviews });
  });
  


