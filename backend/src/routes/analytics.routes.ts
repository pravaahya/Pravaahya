import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import { cache } from '../middleware/cacheMiddleware';

const router = Router();
const analyticsController = new AnalyticsController();

router.get('/summary', protect, adminOnly, cache('analytics', 30), analyticsController.getSummary);

export default router;
