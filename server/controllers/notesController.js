import user from "../DBmodels/userDB.js";
import Notes from "../DBmodels/notesDB.js";

const createNotes = async (req,res) => {
  try {
    const note = req.body;
    const id = req.user.id

    if (!id || !note || !note.trim()) {
      return res.status(400).json({
        success: false,
        msg: "User id and note are required"
      });
    }

    //check if the id exists
    const User = await user.findById(id);
    if(!User){
      return res.status(404).json({
        success:false,
        msg:'User not found'
      });
    }
    
    //note save
    const newnote = await Notes.create({
      user_id:id,
      note:note.trim()
    });

    //success message
    return res.status(200).json({
      success:true,
      msg:'Note created successfully',
      data:note
    });
  } catch (error) {

    console.error(error);
    return res.status(500).json({
      success:false,
      msg:'Internal server error'
    });

  }
}

//update note function 
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;       // note id
    const { note } = req.body;

    if (!id || !note || !note.trim()) {
      return res.status(400).json({
        success: false,
        msg: "Note id and updated note are required"
      });
    }

    const updatedNote = await Notes.findByIdAndUpdate(
      id,
      { note: note.trim() },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        success: false,
        msg: "Note not found"
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Note updated successfully",
      data: updatedNote
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error"
    });
  }
};

//delete note function
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;   // note id

    if (!id) {
      return res.status(400).json({
        success: false,
        msg: "Note id is required"
      });
    }

    const deletedNote = await Notes.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({
        success: false,
        msg: "Note not found"
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Note deleted successfully",
      data: deletedNote
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error"
    });
  }
};

export {createNotes , updateNote , deleteNote}