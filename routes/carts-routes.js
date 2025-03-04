import MongoStore from 'connect-mongo';
import express from 'express';

import {addBookToCart, removeBookFromCart, viewUserCart} from '../controllers/cart-controller.js';
import {verifyToken} from '../middleware/auth-middleware.js';

const cartRouter = express.Router();

// Cart Routes

cartRouter.post('/:id', verifyToken, addBookToCart);
cartRouter.delete('/:id', verifyToken, removeBookFromCart);
cartRouter.get('/', verifyToken, viewUserCart);

export default cartRouter;
