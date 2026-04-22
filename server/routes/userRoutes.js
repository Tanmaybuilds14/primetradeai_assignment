import express from "express";
import { createUser,updateUser,deleteUser } from "../controllers/userController";
import logincontroller from "../controllers/loginController";
import authmidlleware from "../middleware/auth";
import userValidator from "../middleware/uservalidator";


const userRouter = express.Router();
//this file will contain all the routes for user and entity
//login route
router.post('/login',authmidlleware,userValidator,logincontroller);
//register user route
router.post('/register',userValidator,createUser);
//update user route
router.put('/user/:id',authmidlleware,updateUser);
//delete user route
router.delete('/user/:id',authmidlleware,deleteUser)

export default userRouter