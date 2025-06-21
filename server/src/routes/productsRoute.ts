// src/routes/usedCarPartsRoute.ts
import express from 'express';
import {
  getAllUsedCarParts,
  getUsedCarPartById,
  createUsedCarPart,
  updateUsedCarPart,
  deleteUsedCarPart,
} from '../controllers/productsController';

const router = express.Router();

// GET    /used-car-parts          -> listázás
router.get('/', getAllUsedCarParts);

// GET    /used-car-parts/:id      -> egy elem lekérése numeric id alapján
router.get('/:id', getUsedCarPartById);

// POST   /used-car-parts          -> új elem létrehozása
router.post('/', createUsedCarPart);

// PUT    /used-car-parts/:id      -> elem frissítése
router.put('/:id', updateUsedCarPart);

// DELETE /used-car-parts/:id      -> elem törlése
router.delete('/:id', deleteUsedCarPart);

export default router;
