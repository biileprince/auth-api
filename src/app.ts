import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { createRequire } from 'module';
import authRoutes from './routes/auth.routes.js';

const require = createRequire(import.meta.url);
const swaggerDocument = require('./docs/swagger.json');

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Swagger API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check
app.get('/', (_req, res) => {
  res.json({ message: 'Auth API is running' });
});

// Auth routes
app.use(authRoutes);

export default app;
