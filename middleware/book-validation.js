import {body, validationResult} from 'express-validator';
import httpStatusText from '../utils/httpStatusText.js';
import createLogger from '../utils/logger.js';

const logger = createLogger('Book-validation-service');

// Validation rules for creating a book
export const validateCreateBook = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({min: 3})
    .withMessage('Title must be at least 3 characters long'),

  body('author')
    .trim()
    .notEmpty()
    .withMessage('Author is required')
    .isLength({min: 3})
    .withMessage('Author must be at least 3 characters long'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({gt: 0})
    .withMessage('Price must be a positive number'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({max: 500})
    .withMessage('Description must not exceed 500 characters'),

  body('stock')
    .notEmpty()
    .withMessage('Stock is required')
    .isInt({gt: 0})
    .withMessage('Stock must be a positive integer'),

  body('image')
    .optional()
    .isURL()
    .withMessage('Image must be a valid URL'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`Validation failed: ${JSON.stringify(errors.array())}`); // Log errors
      return res.status(400).json({status: httpStatusText.FAIL, errors: errors.array()});
    }
    next();
  }
];

// Validation rules for Updating a book

export const validateUpdateBook = [
  body('title')
    .optional()
    .trim()
    .isLength({min: 3})
    .withMessage('Title must be at least 3 characters long'),

  body('author')
    .optional()
    .trim()
    .isLength({min: 3})
    .withMessage('Author must be at least 3 characters long'),

  body('price')
    .optional()
    .isFloat({gt: 0})
    .withMessage('Price must be a positive number'),

  body('description')
    .optional()
    .trim()
    .isLength({max: 500})
    .withMessage('Description must not exceed 500 characters'),

  body('stock')
    .optional()
    .isInt({gt: 0})
    .withMessage('Stock must be a positive integer'),

  body('image')
    .optional()
    .isURL()
    .withMessage('Image must be a valid URL'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`Validation failed: ${JSON.stringify(errors.array())}`);
      return res.status(400).json({status: httpStatusText.FAIL, errors: errors.array()});
    }
    next();
  }
];
