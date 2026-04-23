import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import userRouter from './routes/userRoutes.js';
import notesRouter from './routes/notesRoutes.js';
import connectDB from './connectDB.js';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

const app = express();

// Database connection
connectDB();

// CORS (required for Vercel — frontend and API may be on different paths)
app.use(cors());

//json parser
app.use(express.json());

//all user routes
app.use('/api', userRouter)
//all notes route
app.use('/notes', notesRouter)

// --- Serve React client in non-Vercel environments (e.g. Render, local prod test) ---
if (!process.env.VERCEL) {
  const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Only listen when running locally (Vercel handles this via serverless)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless function
export default app;