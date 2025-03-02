import express from 'express';
// import  from "../controllers/.js" ;

const reviewRouter = express.Router();

// Books Routes
reviewRouter.post('/', submitReview);
reviewRouter.get('/', getAllReviews);
reviewRouter.get('/:id', getReviewById);
reviewRouter.patch('/:id', updateReview);
reviewRouter.delete('/:id', deleteReview);

export default reviewRouter;
