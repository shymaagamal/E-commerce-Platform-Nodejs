import express from 'express';
import {createBook, deleteBook, getBookById, getBooks, updateBook} from '../controllers/book-controller.js';
import {authorizeAdmin, verifyToken} from '../middleware/auth-middleware.js';
import {validateCreateBook, validateUpdateBook} from '../middleware/book-validation.js';
import {allowedTo} from '../middleware/role-access.js';
import {userRoles} from '../utils/user-roles.js';

const bookRouter = express.Router();

// Book Routes
bookRouter.get('/', getBooks);
bookRouter.get('/:id', getBookById);

// Admin Only
bookRouter.post('/', authorizeAdmin, validateCreateBook, createBook);
bookRouter.patch('/:id', authorizeAdmin, validateUpdateBook, updateBook);
bookRouter.delete('/:id', authorizeAdmin, deleteBook);

// bookRouter.delete('/:id', verifyToken, allowedTo[userRoles.ADMIN], deleteBook);

export default bookRouter;
