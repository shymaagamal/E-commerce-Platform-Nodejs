import express from 'express';
import {createBook, deleteBook, getBookById, getBooks, updateBook} from '../controllers/book-controller.js';
import {authorizeAdmin} from '../middleware/auth-Middleware.js';
import {validateCreateBook, validateUpdateBook} from '../middleware/book-validation.js';

const bookRouter = express.Router();

// Book Routes
bookRouter.get('/', getBooks);
bookRouter.get('/:id', getBookById);

// Admin Only
bookRouter.post('/', authorizeAdmin, validateCreateBook, createBook);
bookRouter.patch('/:id', authorizeAdmin, validateUpdateBook, updateBook);
bookRouter.delete('/:id', authorizeAdmin, deleteBook);

export default bookRouter;
