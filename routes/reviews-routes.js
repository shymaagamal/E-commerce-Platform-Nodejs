import express from 'express';
import { createReview, getReviews, updateReview, deleteReview } from '../controllers/review-controller.js';
import {reviewValidation,updateReviewValidation,validateObjectId} from '../middleware/review-validation.js';
import { verifyToken } from '../middleware/auth-middleware.js';

const reviewRouter = express.Router();

reviewRouter.use(verifyToken);

reviewRouter.post('/',reviewValidation, createReview);

reviewRouter.get('/book/:id',validateObjectId,getReviews);

reviewRouter.patch('/:id',validateObjectId,updateReviewValidation, updateReview);

reviewRouter.delete('/:id' ,validateObjectId,deleteReview)

export default reviewRouter;
