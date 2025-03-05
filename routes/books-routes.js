import express from 'express';
import {createBook, deleteBook, getBookById, getBooks, updateBook} from '../controllers/book-controller.js';
import {verifyToken} from '../middleware/auth-middleware.js';
import {validateCreateBook, validateUpdateBook} from '../middleware/book-validation.js';
import {morganMiddleware} from '../middleware/morgan-middleware.js';
import {allowedTo} from '../middleware/role-access.js';
import upload from '../middleware/uploadMiddleware.js';
import {userRoles} from '../utils/user-roles.js';

export const bookRouter = express.Router();

bookRouter.use(express.json());
bookRouter.use(morganMiddleware);

// Book Routes
bookRouter.get('/', verifyToken, getBooks);
bookRouter.get('/:id', verifyToken, getBookById);

// Admin Only
bookRouter.post('/', verifyToken, allowedTo([userRoles.ADMIN]), validateCreateBook, upload.single('coverImage'), createBook);
bookRouter.patch('/:id', verifyToken, allowedTo([userRoles.ADMIN]), validateUpdateBook, updateBook);
bookRouter.delete('/:id', verifyToken, allowedTo([userRoles.ADMIN]), deleteBook);

// bookRouter.delete('/:id', verifyToken, allowedTo[userRoles.ADMIN], deleteBook);

export default bookRouter;
