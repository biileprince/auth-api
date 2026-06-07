import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb, saveDb } from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
// Token expiration in seconds (15 minutes)
const JWT_EXPIRES_IN = 900;

const SALT_ROUNDS = 10;

/**
 * POST /register
 * Creates a new user with a hashed password.
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      res.status(400).json({ error: 'Username and password must be strings' });
      return;
    }

    if (username.length < 3) {
      res.status(400).json({ error: 'Username must be at least 3 characters long' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long' });
      return;
    }

    const db = getDb();

    // Check if username already exists
    const existingUser = db.exec('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUser.length > 0 && existingUser[0].values.length > 0) {
      res.status(409).json({ error: 'Username already exists' });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert the new user
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    saveDb();

    // Retrieve the created user's id
    const result = db.exec('SELECT id FROM users WHERE username = ?', [username]);
    const userId = result[0].values[0][0];

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: userId,
        username,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * POST /login
 * Authenticates a user and returns a JWT.
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    const db = getDb();

    // Find user by username
    const result = db.exec('SELECT id, username, password FROM users WHERE username = ?', [username]);
    if (result.length === 0 || result[0].values.length === 0) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    const [userId, , hashedPassword] = result[0].values[0] as [number, string, string];

    // Compare provided password with stored hash
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // Generate JWT
    const token = jwt.sign(
      { id: userId, username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /profile
 * Returns the authenticated user's profile information.
 * Requires a valid JWT (handled by auth middleware).
 */
export function getProfile(req: AuthenticatedRequest, res: Response): void {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const db = getDb();

    // Fetch user details (excluding password)
    const result = db.exec(
      'SELECT id, username, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const [id, username, createdAt] = result[0].values[0] as [number, string, string];

    res.status(200).json({
      user: {
        id,
        username,
        created_at: createdAt,
      },
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
