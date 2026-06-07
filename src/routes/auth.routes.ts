import { Router } from 'express';
import { register } from '../controllers/auth.controller.js';

const router = Router();

// POST /register - Create a new user
router.post('/register', register);

export default router;
