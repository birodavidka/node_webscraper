// server/scripts/uploadData.ts

import * as admin from 'firebase-admin';
import { usedCars, usedCarParts } from '../src/data/exampeData';
import serviceAccount from '../serviceAccountKey.json';  // így TS-ben hozzá kell engedélyezni az "resolveJsonModule"-t a tsconfigban

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key,
  }),
  projectId: serviceAccount.project_id,
});

const db = admin.firestore();

async function uploadCollection(collectionName: string, dataArray: any[]) {
  const batch = db.batch();

  dataArray.forEach(item => {
    // Dokumentum kulcs legyen az item.id string formában
    const docRef = db.collection(collectionName).doc(item.id.toString());
    batch.set(docRef, item);
  });

  await batch.commit();
  console.log(`Uploaded ${dataArray.length} records to '${collectionName}'`);
}

async function main() {
  try {
    await uploadCollection('usedCars', usedCars);
    await uploadCollection('usedCarParts', usedCarParts);
    console.log('All data uploaded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error uploading data:', error);
    process.exit(1);
  }
}

main();
