import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../db_model/userDB.js';
dotenv.config();

const authmidlleware = async (req,res,next) =>{
 try {
  const authheader  = req.headers.authorization;

 if(!authheader || !authheader.startsWith('Bearer ')){
  return res.status(401).json({msg:'token not found'});
 }

 //extracting actual token
  const token = authheader.split(" ")[1];
 //verifying extracted token
  const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
 
 //check if user exists in database
  const user = await User.findById(decoded.userid);
  if(!user){
    return res.status(404).json({msg:'user not found in database'});
  }
  
 //sending decoded payload
  req.user = decoded.userid;
  next();
 } catch (error) {
  console.error(error.message);
  return res.status(500).json({msg:'internal server error'});
 }
}


export default authmidlleware