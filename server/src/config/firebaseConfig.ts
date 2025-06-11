// server/src/config/firebaseConfig.ts
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// A private key-be a \n-eket visszaalakítjuk valódi új sorokra:
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

if (
  !process.env.FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_CLIENT_EMAIL ||
  !privateKey
) {
  throw new Error('Firebase service account environment variables are not set.');
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey,
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

export const firestore = admin.firestore();
export const realtimeDb = admin.database();
export default admin;
