import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';

const router = Router();
const paymentController = new PaymentController();

import { validateGuestCheckout } from '../middleware/validateGuestCheckout';

// Map secure payment gateways natively 
router.post('/create-order', validateGuestCheckout, paymentController.createOrder);
router.post('/verify', paymentController.verifyPayment);

export default router;
