import express from 'express';
import authRoutes from './routes/auth.routes.js';

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Health check
app.get('/', (_req, res) => {
  res.json({ message: 'Auth API is running' });
});

// Auth routes
app.use(authRoutes);

export default app;
