import express from 'express'
import userRouter from './routes/userRoutes.js';
import notesRouter from './routes/notesRoutes.js';
import connectDB from './connectDB.js';

const PORT = 5000

const app = express();

// Database connection
connectDB();
//json parser
app.use(express.json());
//all user routes
app.use('/api',userRouter)
//all notes route
app.use('/notes',notesRouter)
//test route
app.get('/',(req,res)=>{
  res.status(200).json({
    success:true,
    msg:'server running successfully'
  })
})

app.listen(PORT,()=>{
 console.log(`server running on http://localhost:${PORT}`);
});