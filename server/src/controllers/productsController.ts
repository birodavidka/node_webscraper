// server/src/controllers/usedCarPartsController.ts
import { NextFunction, Request, Response } from 'express';
import { firestore as db } from '../config/firebaseConfig';
import admin from 'firebase-admin';

// referencia a Firestore-gyűjteményre
const partsCollection = db.collection('usedCarParts');

/**
 * GET /used-car-parts
 * Összes használt alkatrész lekérdezése
 */
export const getAllUsedCarParts =  async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> =>  {
  try {
    const snapshot = await partsCollection.orderBy('id', 'asc').get();
    const parts = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        // itt a dokumentum saját ID-ját nem használjuk kulcsként,
        // mert a példádban van külön numeric id mező
        id: data.id as number,
        name: data.name as string,
        description: data.description as string,
        price: data.price as number,
        imageUrl: data.imageUrl as string,
      };
    });
    res.status(200).json({ data: parts });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /used-car-parts/:id
 * Egy alkatrész lekérdezése a numeric `id` mező alapján
 */
export const getUsedCarPartById =  async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const idNum = parseInt(req.params.id, 10);
    if (isNaN(idNum)) {
      res.status(400).json({ message: 'Invalid part ID' });
      return;
    }
    const snapshot = await partsCollection
      .where('id', '==', idNum)
      .limit(1)
      .get();

    if (snapshot.empty) {
      res.status(404).json({ message: 'Part not found' });
      return;
    }
    const data = snapshot.docs[0].data();
    res.status(200).json({
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /used-car-parts
 * Új alkatrész létrehozása.
 * A body-nak tartalmaznia kell: { id: number, name: string, description: string, price: number, imageUrl: string }
 */
export const createUsedCarPart =  async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> =>  {
  try {
    const { id, name, description, price, imageUrl } = req.body;
    if (typeof id !== 'number' || !name || !description || typeof price !== 'number' || !imageUrl) {
      res.status(400).json({ message: 'Missing or invalid fields' });
      return;
    }

    // ellenőrizheted, hogy nincs-e már ilyen numeric id
    const exists = await partsCollection.where('id', '==', id).limit(1).get();
    if (!exists.empty) {
      res.status(409).json({ message: 'Part with this ID already exists' });
      return;
    }

    // létrehozás: Firestore automatikus dokumentumkulccsal, de a mezőben benne az általad adott numeric id
    await partsCollection.add({
      id,
      name,
      description,
      price,
      imageUrl,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'Part created successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * PUT /used-car-parts/:id
 * Alkatrész frissítése a numeric `id` mező alapján.
 * Body-ban bármi módosítható: name, description, price, imageUrl
 */
export const updateUsedCarPart =  async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> =>  {
  try {
    const idNum = parseInt(req.params.id, 10);
    if (isNaN(idNum)) {
      res.status(400).json({ message: 'Invalid part ID' });
      return
    }
    const snapshot = await partsCollection.where('id', '==', idNum).limit(1).get();
    if (snapshot.empty) {
      res.status(404).json({ message: 'Part not found' });
      return
    }

    const docRef = snapshot.docs[0].ref;
    const updates: any = {
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await docRef.update(updates);

    const updatedSnap = await docRef.get();
    const data = updatedSnap.data()!;
    res.status(200).json({
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE /used-car-parts/:id
 * Alkatrész törlése a numeric `id` mező alapján
 */
export const deleteUsedCarPart =  async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const idNum = parseInt(req.params.id, 10);
    if (isNaN(idNum)) {
      res.status(400).json({ message: 'Invalid part ID' });
      return;
    }
    const snapshot = await partsCollection.where('id', '==', idNum).limit(1).get();
    if (snapshot.empty) {
      res.status(404).json({ message: 'Part not found' });
      return;
    }
    await snapshot.docs[0].ref.delete();
    res.status(200).json({ message: 'Part deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
