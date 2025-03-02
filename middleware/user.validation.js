import {body} from 'express-validator';

export const validateUser = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({min: 3})
    .withMessage('Username must be at least 3 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({min: 8})
    .withMessage('Password must be at least 8 characters'),

  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Invalid role, must be either user or admin')
];
