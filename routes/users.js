import express from "express";
// import  from "../controllers/.js" ;


const userRouter = express.Router();


// User Routes
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.patch("/:id", updateProfile);


export default userRouter;