import express from 'express';
// import  from "../controllers/.js" ;

const cartRouter = express.Router();

// Cart Routes
cartRouter.get('/', viewAllCarts);
cartRouter.get('/:id', viewCartById);
cartRouter.patch('/:id', AddBook);
cartRouter.delete('/:id', removeBook);

export default cartRouter;
