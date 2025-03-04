import express from 'express';
// import  from "../controllers/.js" ;
import {morganMiddleware} from '../middleware/morgan-middleware.js';

const reviewRouter = express.Router();

reviewRouter.use(morganMiddleware);

// Books Routes
reviewRouter.post('/', submitReview);
reviewRouter.get('/', getAllReviews);
reviewRouter.get('/:id', getReviewById);
reviewRouter.patch('/:id', updateReview);
reviewRouter.delete('/:id', deleteReview);

export default reviewRouter;
