import { Router } from 'express';
import { CouponController } from '../controllers/coupon.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';

const router = Router();
const couponController = new CouponController();

// Publicly active resolution hooks tracking live checkout queries
router.get('/featured', couponController.getFeaturedCoupon);
router.post('/validate', couponController.validateCoupon);

// Secured Administrative Management Network
router.use(protect, adminOnly);

router.post('/', couponController.createCoupon);
router.get('/', couponController.getCoupons);
router.put('/:id', couponController.updateCoupon);
router.delete('/:id', couponController.deleteCoupon);

export default router;
