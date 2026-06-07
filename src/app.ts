import express from 'express';

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Health check
app.get('/', (_req, res) => {
  res.json({ message: 'Auth API is running' });
});

export default app;
