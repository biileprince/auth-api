import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

/**
 * Extend Express Request to include the authenticated user payload.
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
  };
}

/**
 * Middleware that verifies the JWT from the Authorization header.
 * Attaches the decoded user payload to req.user if valid.
 * Returns 401 if the token is missing, invalid, or expired.
 */
export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Access denied. No token provided.' });
    return;
  }

  // Expect format: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({ error: 'Access denied. Invalid token format. Use: Bearer <token>' });
    return;
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; username: string };
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token has expired. Please login again.' });
    } else {
      res.status(401).json({ error: 'Invalid token.' });
    }
  }
}
