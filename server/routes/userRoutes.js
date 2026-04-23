import express from "express";
import { createUser,updateUser,deleteUser } from "../controllers/userController.js";
import logincontroller from "../controllers/loginController.js";
import authmidlleware from "../middleware/auth.js";
import userValidator from "../middleware/uservalidator.js";


const userRouter = express.Router();
//this file will contain all the routes for user and entity
//login route
userRouter.post('/login',authmidlleware,userValidator,logincontroller);
//register user route
userRouter.post('/register',userValidator,createUser);
//update user route
userRouter.put('/user/:id',authmidlleware,updateUser);
//delete user route
userRouter.delete('/user/:id',authmidlleware,deleteUser)

export default userRouter