import { body } from 'express-validator';

const reviewValidation = [
  body('user')
  .notEmpty().withMessage('User ID is required')
  .isMongoId().withMessage('Invalid User ID format'),
  body('book')
  .notEmpty().withMessage('Book ID is required')
  .isMongoId().withMessage('Invalid Book ID format'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  body('review')
    .notEmpty().withMessage('Review text is required')
    .isLength({ max: 500 }).withMessage('Review text cannot exceed 500 characters')
    .trim()
];

export default reviewValidation;
