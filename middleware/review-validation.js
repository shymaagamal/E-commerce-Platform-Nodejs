import { body ,param} from 'express-validator';


export const validateObjectId = [
  param('id').isMongoId().withMessage('Invalid ID format'),
];

export const reviewValidation = [
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

export const updateReviewValidation = [
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),

  body('review')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Review must be a string between 1 and 500 characters')
];

