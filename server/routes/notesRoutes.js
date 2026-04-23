import { createNotes , updateNote , deleteNote } from "../controllers/notesController.js";
import express from 'express';
import authmidlleware from "../middleware/auth.js";

const notesRouter = express.Router();

//create notes route
notesRouter.post('/create',authmidlleware,createNotes);
//update notes route
notesRouter.put('/update/:id',authmidlleware,updateNote);
//delete notes route
notesRouter.delete('/delete/:id',authmidlleware,deleteNote)

export default notesRouter