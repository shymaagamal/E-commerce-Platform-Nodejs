import {body} from 'express-validator';
import { userRoles } from '../utils/user-roles.js';

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
    .customSanitizer((value) => value?.toLowerCase())
    .isIn([userRoles.USER, userRoles.ADMIN])
    .withMessage('Invalid role, must be either user or admin')
];



export const validateUserUpdate = [
  body('name')
    .optional() 
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),

  body('role')
    .optional()
    .customSanitizer((value) => value?.toLowerCase())
    .isIn([userRoles.USER, userRoles.ADMIN])
    .withMessage('Invalid role, must be either user or admin')
];
