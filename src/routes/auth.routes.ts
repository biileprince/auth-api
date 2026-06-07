import { Router } from 'express';
import { register, login, getProfile } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// POST /register - Create a new user
router.post('/register', register);

// POST /login - Authenticate and get JWT
router.post('/login', login);

// GET /profile - Get authenticated user's profile (protected)
router.get('/profile', authenticate, getProfile);

export default router;
