import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

// POST /register - Create a new user
router.post('/register', register);

// POST /login - Authenticate and get JWT
router.post('/login', login);

export default router;
