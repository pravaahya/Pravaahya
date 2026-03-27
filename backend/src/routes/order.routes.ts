import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';

const router = Router();
const orderController = new OrderController();

// Target admin logic strictly isolating operational limits onto secured HTTP routes seamlessly
router.get('/', protect, adminOnly, orderController.getOrders);
router.get('/:id', protect, adminOnly, orderController.getOrder);
router.put('/:id', protect, adminOnly, orderController.updateOrderStatus);

// Map dynamic URL structure effectively enforcing transaction bounds natively
router.get('/:id/invoice', orderController.getInvoice);

export default router;
