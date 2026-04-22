import mongoose from "mongoose";

const NotesDB = new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user',
    required:true
  },
  note:{
    require:true,
    type:String
  }
});

const Notes = mongoose.model('Notes',NotesDB);
export default Notes;