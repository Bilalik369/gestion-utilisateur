import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {connectDb} from './lib/db.js';
import { logRequest } from './middleware/logger.js';


import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

connectDb();

const app = express();


app.use(express.json());


app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));


app.use(logRequest);


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});