import express from 'express';
import connectDB from './database/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './Routes/authRoutes.js';
import blogRoutes from './Routes/blogRoutes.js';
import aiRoutes from './Routes/aiRoutes.js';
import errorHandler from './Middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json());


// Connect to MongoDB
connectDB();

app.get('/health-check', (req, res) => {
  res.status(200).json({ message: "The server is running fine...!" });
});


app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use("/api/ai", aiRoutes);

app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
