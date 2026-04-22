import express from 'express';
import userRouter from './routes/userRoutes';

app = express();
app.use(express.json());
//all user routes
app.use('/api',userRouter)