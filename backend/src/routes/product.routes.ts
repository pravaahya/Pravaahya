import { Router } from 'express';
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import { uploadFiles } from '../middleware/upload.middleware';
import { cache } from '../middleware/cacheMiddleware';

const router = Router();

router.route('/')
  .get(cache('products', 120), getProducts)
  .post(protect, adminOnly, uploadFiles.array('images', 5), createProduct);

router.route('/:id')
  .get(cache('products', 120), getProduct)
  .put(protect, adminOnly, uploadFiles.array('images', 5), updateProduct)
  .delete(protect, adminOnly, deleteProduct);

export default router;
