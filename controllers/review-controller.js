import Review from '../models/review-model.js';
import { asyncWrapper } from '../utils/async-wrapper.js';
import httpStatusText from '../utils/http-status-text.js';
import createLogger from '../utils/logger.js';
import { validationResult } from 'express-validator';

const userLogger = createLogger('review-service');

export const createReview = asyncWrapper(async (req, res, next) => {
    req.body.user = req.user.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessage = errors.array().map(err => err.msg).join(', ');
        userLogger.error('Validation failed', { errors: errors.array() });

        const error = new Error(`Validation failed: ${errorMessage}`);
        error.status = 400;
        error.httpStatusText = httpStatusText.FAIL;
        return next(error);
    }
    const review = await Review.create(req.body);
    userLogger.info('New review created successfully');
    res.status(201).json({ status: httpStatusText.SUCCESS, data: review });
});

export const updateReview = asyncWrapper(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessage = errors.array().map(err => err.msg).join(', ');
        userLogger.error('Validation failed', { errors: errors.array() });

        const error = new Error(`Validation failed: ${errorMessage}`);
        error.status = 400;
        error.httpStatusText = httpStatusText.FAIL;
        return next(error);
    }

    if (!review) {
        userLogger.error(`Review with id ${req.params.id} not found`);
        const error = new Error(`Review with id ${req.params.id} not found`);
        error.status = 404;
        error.httpStatusText = httpStatusText.FAIL;
        return next(error);
    }

    if (review.user.toString() !== req.user.id) {
        userLogger.error(`Unauthorized: User ${req.user.id} is not allowed to update review ${req.params.id}`);
        const error = new Error(`You are not authorized to update this review.`);
        error.status = 403;
        error.httpStatusText = httpStatusText.FAIL;
        return next(error);
    }

    Object.keys(req.body).forEach((key) => {
        review[key] = req.body[key];
    });
    await review.save();

    userLogger.info(`Review with id ${req.params.id} updated successfully`);
    res.json({ status: httpStatusText.SUCCESS, data: review });
});

export const deleteReview = asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessage = errors.array().map(err => err.msg).join(', ');
        userLogger.error('Validation failed', { errors: errors.array() });

        const error = new Error(`Validation failed: ${errorMessage}`);
        error.status = 400;
        error.httpStatusText = httpStatusText.FAIL;
        return next(error);
    }

    const { id } = req.params;
    const review = await Review.findOneAndDelete({ _id: id, user: req.user.id });

    if (!review) {
        userLogger.error(`Review with id ${req.params.id} not found or unauthorized`);
        const error = new Error(`Review not found or you are not authorized to delete it.`);
        error.status = 404;
        error.httpStatusText = httpStatusText.FAIL;
        return next(error);
    }

    userLogger.info(`Review with id ${req.params.id} deleted`);
    res.json({ status: httpStatusText.SUCCESS, message: 'Review deleted successfully' });
});

export const getReviews = asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessage = errors.array().map(err => err.msg).join(', ');
        userLogger.error('Validation failed', { errors: errors.array() });

        const error = new Error(`Validation failed: ${errorMessage}`);
        error.status = 400;
        error.httpStatusText = httpStatusText.FAIL;
        return next(error);
    }

    const { id } = req.params;
    const reviews = await Review.find({ book: id }).populate('user', 'name').populate('book', 'title');

    if (!reviews.length) {
        userLogger.info(`No reviews found for book with id ${id}`);
        return res.json({ status: httpStatusText.SUCCESS, averageRating: 0, message: "No reviews found for book", data: [] });
    }
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    userLogger.info(`Reviews for book with id ${id} fetched`);
    res.json({ status: httpStatusText.SUCCESS, averageRating: averageRating.toFixed(2), data: reviews });
});
