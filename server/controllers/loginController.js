import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import user from "../DBmodels/userDB.js";
import dotenv from 'dotenv';
dotenv.config();

const logincontroller = async (req,res)=>{
  try {
    const {email,password} = req.body;
    //returns a object if user is found
    const User = await user.findOne({email}).select("+password");

    //if user is not found case:
    if(!User){
      return res.status(400).json({
       success:false,
       msg:'Invalid email or password'
      });
    }

    //if user is found matching password:
    const ismatch = await bcrypt.compare(password,User.password);

    //if password dosent matches the actual password:
    if(!ismatch){
      return res.status(400).json({
        success:false,
        msg:'Invalid email or password'
      })
    }
    const token = jwt.sign(
      {
      id:User._id,
      email:User.email,
      logintype:User.logintype
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json('Internal server error');
  }
}

export default logincontroller