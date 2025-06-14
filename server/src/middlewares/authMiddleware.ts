// server/src/middlewares/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import firebaseService from '../services/firbaseService';

/**
 * Express middleware to protect routes: verifies Firebase ID token
 * and attaches decodedToken to req.user
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization header missing or malformed' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = await firebaseService.verifyToken(token);
    (req as any).user = decodedToken;
    next();
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};
