import express from 'express';
import {getBookById, getBooks} from '../controllers/bookController.js';

const bookRouter = express.Router();

// Book Routes
bookRouter.post('/', addBook);
bookRouter.get('/', getBooks);
bookRouter.get('/:id', getBookById);
bookRouter.patch('/:id', updateBook);
bookRouter.delete('/:id', deleteBook);

export default bookRouter;
