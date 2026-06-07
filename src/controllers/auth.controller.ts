import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { getDb, saveDb } from '../config/db.js';

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
