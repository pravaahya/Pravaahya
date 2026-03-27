import { Router } from 'express';
import { StockController } from '../controllers/stock.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';

const router = Router();
const stockController = new StockController();

// Target admin logic strictly isolating operational limits onto secured HTTP routes seamlessly
router.get('/low', protect, adminOnly, stockController.getLowStockEvents);

export default router;
