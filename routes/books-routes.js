import express from 'express';
import {createBook, getBookById, getBooks} from '../controllers/book.controller.js';
import {authorizeAdmin} from '../middleware/authMiddleware.js';

const bookRouter = express.Router();

// Book Routes
bookRouter.get('/', getBooks);
bookRouter.get('/:id', getBookById);

// Admin Only
bookRouter.post('/', authorizeAdmin, createBook);
bookRouter.patch('/:id', updateBook);
bookRouter.delete('/:id', deleteBook);

export default bookRouter;
