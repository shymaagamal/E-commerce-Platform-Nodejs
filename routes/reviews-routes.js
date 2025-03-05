import express from 'express';
import { createReview, getReviews, updateReview, deleteReview } from '../controllers/review-controller.js';
import {reviewValidation,updateReviewValidation} from '../middleware/review-validation.js';
import { verifyToken } from '../middleware/auth-middleware.js';

const reviewRouter = express.Router();
// adding verify token middleware to the routes
// reviewRouter.use(verifyToken);

reviewRouter.post('/',reviewValidation, createReview);

reviewRouter.get('/book/:bookId',  getReviews);

reviewRouter.patch('/:id',updateReviewValidation, updateReview);

reviewRouter.delete('/:id',deleteReview)

export default reviewRouter;
