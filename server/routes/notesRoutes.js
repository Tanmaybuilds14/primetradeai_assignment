import { createNotes , getNotes , updateNote , deleteNote } from "../controllers/notesController.js";
import express from 'express';
import authmidlleware from "../middleware/auth.js";

const notesRouter = express.Router();

//get all notes route
notesRouter.get('/all',authmidlleware,getNotes);
//create notes route
notesRouter.post('/create',authmidlleware,createNotes);
//update notes route
notesRouter.put('/update/:id',authmidlleware,updateNote);
//delete notes route
notesRouter.delete('/delete/:id',authmidlleware,deleteNote)

export default notesRouter