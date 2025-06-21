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

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
) as admin.ServiceAccount;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

const firestore = admin.firestore();
const realtimeDb = admin.database();

export { admin, firestore, realtimeDb };