// server/src/controllers/authController.ts

import { Request, Response, NextFunction } from 'express';
import firebaseService from '../services/firbaseService';

/**
 * Registers a new user: calls firebaseService.registerUser
 * and returns UID and email.
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password, ...profileData } = req.body;
  try {
    const userRecord = await firebaseService.registerUser(
      { email, password },
      profileData
    );
    res.status(201).json({ uid: userRecord.uid, email: userRecord.email });
  } catch (error: any) {
    next(error);
  }
};

/**
 * Logs in a user: verifies ID token sent in Authorization header
 * and returns decoded token payload.
 */
export const login = async (
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
    res.json({
      email: decodedToken.email,
      ...decodedToken,
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * Retrieves user profile from Firestore by UID.
 * Expects UID either as URL param or attached to req.user by middleware.
 */
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const uid = (req as any).user?.uid ?? req.params.uid;
  if (!uid) {
    res.status(400).json({ error: 'No UID provided' });
    return;
  }
  try {
    const profile = await firebaseService.getDocument('users', uid);
    if (!profile) {
      res.status(404).json({ error: 'User profile not found' });
      return;
    }
    res.json(profile);
  } catch (error: any) {
    next(error);
  }
};
