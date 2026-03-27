import { Router } from 'express';
import { createCollection, getCollections, getCollection, updateCollection, deleteCollection } from '../controllers/collection.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import { uploadFiles } from '../middleware/upload.middleware';

const router = Router();

router.route('/')
  .get(getCollections)
  .post(protect, adminOnly, uploadFiles.array('image', 1), createCollection);

router.route('/:id')
  .get(getCollection)
  .put(protect, adminOnly, uploadFiles.array('image', 1), updateCollection)
  .delete(protect, adminOnly, deleteCollection);

export default router;
