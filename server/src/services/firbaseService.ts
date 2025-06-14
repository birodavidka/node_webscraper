import admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const keyPath = path.resolve(__dirname, '../../serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
console.log('Loaded serviceAccount for project:', serviceAccount.project_id);

dotenv.config();

// Parse service account credentials from environment variable
/* const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
) as ServiceAccount;
 */
// Initialize Firebase App only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

// Expose Auth and Firestore instances
const auth = admin.auth();
const db = admin.firestore();

// -------------------- Authentication --------------------

/**
 * Verifies a Firebase ID token and returns decoded token payload
 * @param token - Firebase ID token
 */
export const verifyToken = async (token: string) => {
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Retrieves a user by UID
 * @param uid - Firebase Auth user UID
 */
export const getUser = async (uid: string) => {
  return auth.getUser(uid);
};

/**
 * Creates a new Firebase Auth user
 * @param userData - CreateRequest object
 */
export const createUser = async (
  userData: admin.auth.CreateRequest
) => {
  return auth.createUser(userData);
};

/**
 * Registers a new user: creates an Auth user and a Firestore profile document
 * @param userData - CreateRequest object for Auth user
 * @param profileData - Additional profile fields to store in Firestore
 */
export const registerUser = async (
  userData: admin.auth.CreateRequest,
  profileData: Record<string, unknown>
) => {
  // Create Auth user
  const userRecord = await auth.createUser(userData);

  // Build profile object with Firestore document ID
  const profile = { id: userRecord.uid, ...profileData };

  // Save to 'users' collection
  await db.collection('users').doc(userRecord.uid).set(profile);

  return userRecord;
};

// ---------------------- Database -----------------------

/**
 * Gets a reference to a Firestore collection
 * @param collectionName - Name of the collection
 */
export const getCollection = (collectionName: string) =>
  db.collection(collectionName);

/**
 * Retrieves a document from a collection
 * @param collectionName - Collection name
 * @param docId - Document ID
 */
export const getDocument = async (
  collectionName: string,
  docId: string
) => {
  const docRef = db.collection(collectionName).doc(docId);
  const docSnap = await docRef.get();
  return docSnap.exists ? docSnap.data() : null;
};

/**
 * Creates or updates a document in a collection
 * @param collectionName - Collection name
 * @param docId - Document ID
 * @param data - Data to set
 */
export const setDocument = async (
  collectionName: string,
  docId: string,
  data: any
) => {
  const docRef = db.collection(collectionName).doc(docId);
  await docRef.set(data, { merge: true });
  return docRef;
};

/**
 * Deletes a document from a collection
 * @param collectionName - Collection name
 * @param docId - Document ID
 */
export const deleteDocument = async (
  collectionName: string,
  docId: string
) => {
  await db.collection(collectionName).doc(docId).delete();
};

// Default export for convenience
export default {
  auth,
  db,
  verifyToken,
  getUser,
  createUser,
  registerUser,
  getCollection,
  getDocument,
  setDocument,
  deleteDocument,
};
