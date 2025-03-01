import express from "express";
// import  from "../controllers/.js" ;


const bookRouter = express.Router();


// Book Routes
bookRouter.post("/", addBook);
bookRouter.get("/", getAllBooks);
bookRouter.get("/:id", getBookById);
bookRouter.patch("/:id", updateBook);
bookRouter.delete("/:id", deleteBook);


export default bookRouter;