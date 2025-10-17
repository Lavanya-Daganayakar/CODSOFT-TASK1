import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import fs from 'fs';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applications.js';
import searchRoutes from './routes/search.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/search', searchRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/jobboard';

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (e) {
    console.warn('MongoDB connection failed, starting in-memory MongoDB...', e?.message || e);
    const mem = await MongoMemoryServer.create();
    const uri = mem.getUri();
    await mongoose.connect(uri);
    console.log('Connected to in-memory MongoDB');
  }
  // ensure upload directories exist
  try {
    fs.mkdirSync('uploads/resumes', { recursive: true });
    fs.mkdirSync('uploads/applications', { recursive: true });
  } catch (e) {
    console.warn('Failed to ensure upload directories', e?.message || e);
  }
  app.listen(PORT, () => console.log(`API running on :${PORT}`));
}

start();


