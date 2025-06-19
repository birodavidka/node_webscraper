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
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required for registration' });
    return;
  }

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
 * Logs in a user: accepts email/password in body,
 * calls firebaseService.loginUser to get ID token,
 * verifies it and returns token payload.
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password must be provided' });
    return;
  }

  try {
    // Authenticate with Firebase via REST API
    const { idToken } = await firebaseService.loginUser({ email, password });
    // Verify the token to get decoded payload
    const decoded = await firebaseService.verifyToken(idToken);
    // Return both token and user data
    res.json({ idToken, ...decoded });
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