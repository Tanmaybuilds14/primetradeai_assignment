import user from "../DBmodels/userDB.js";
import bcrypt from "bcrypt";

const createUser = async (req,res) => {
  try {
    const {
      username,
      email,
      password,
    } = req.body
    
    //checking for duplicate login email
    const duplicateUser = await user.findOne({email});
    if(duplicateUser){
      return res.status(409).json({
        success: false,
        message: "User already exists with this email"
      });
    }
    

    const newUser = await user.create({
      username,
      email,
      password,
    })

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      User:{
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt
      }});

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({msg:error.message});
  }
}

const updateUser = async (req,res) => {
  try {

  const {id} = req.params;
  const {username,email,currentPassword,newPassword} = req.body;

  const User = await user.findById(id).select('+password');

  if(!User){
    return res.status(404).json({
      success:false,
      msg:'user not found'
    });
  }

  if(email && email!==User.email){
    //duplicate user email check
    const existinguser = await user.findOne({email});
    if(existinguser){
      return res.status(409).json({
        success:false,
        msg:'email already in use'
      });
    }
  }

  // Handle password change
  if(currentPassword && newPassword){
    const isMatch = await bcrypt.compare(currentPassword, User.password);
    if(!isMatch){
      return res.status(400).json({
        success:false,
        msg:'Current password is incorrect'
      });
    }
    if(newPassword.length < 6){
      return res.status(400).json({
        success:false,
        msg:'New password must be at least 6 characters'
      });
    }
    User.password = newPassword;
  }

  User.username = username || User.username;
  User.email = email || User.email;
  
  const updatedUser = await User.save();

  res.status(200).json({
    success:true,
    msg:'user updated successfully',
    data:{
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email
    }
  });


  } catch (error) {

    console.error(error.message);
    return res.status(500).json({
      success:false,
      msg:'internal server error'
    });

  }
}

const deleteUser = async (req,res) => {
  try {
    const {id} = req.params;

    const User = await user.findById(id);
    if(!User){
      return res.status(404).json({
        success:false,
        msg:'Resource not found'
      });
    }

    await User.deleteOne();

    return res.status(200).json({
      success:true,
      msg:'user deleted'
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success:false,
      msg:'Internal server error'
    });
  }
}

export {createUser,updateUser,deleteUser}
