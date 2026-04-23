import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userDB = new mongoose.Schema({
 username:{
  type:String,
  require:true,
  trim:true
 },
 email:{
  type:String,
  require:true,
  trim:true
 },
 password:{
  type:String,
  require:true,
  trim:true
 }
},{ timestamps: true });

userDB.pre('save', async function(){
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
})

const user = mongoose.model('user',userDB);
export default user;