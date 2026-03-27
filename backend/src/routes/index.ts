import { Router } from 'express';
import { ExampleController } from '../controllers/example.controller';
import authRoutes from './auth.routes';
import paymentRoutes from './payment.routes';
import orderRoutes from './order.routes';
import adminRoutes from './admin.routes';
import productRoutes from './product.routes';
import stockRoutes from './stock.routes';
import analyticsRoutes from './analytics.routes';
import collectionRoutes from './collection.routes';
import userRoutes from './user.routes';
import couponRoutes from './coupon.routes';

const router = Router();
const exampleController = new ExampleController();

import mongoose from 'mongoose';

// Global Mongoose Offline Resilience Interceptor
router.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1 && req.method === 'GET') {
    const p = req.path;
    if (p.includes('/admin/insights')) {
      return res.status(200).json({
        success: true,
        data: { totalOrders: 0, totalRevenue: 0, totalUsers: 0, monthlyOrders: [0,0,0,0,0,0,0,0,0,0,0,0], monthlyRevenue: [0,0,0,0,0,0,0,0,0,0,0,0] }
      });
    }
    if (p.includes('/products') || p.includes('/orders') || p.includes('/collections')) {
      return res.status(200).json({ success: true, count: 0, products: [], data: [], orders: [] });
    }
    if (p.includes('/coupons/featured')) {
      return res.status(200).json({ success: true, data: null });
    }
    if (p.includes('/coupons')) {
      return res.status(200).json({ success: true, data: [] });
    }
    if (p.includes('/analytics/summary')) {
      return res.status(200).json({
        success: true,
        data: { totalVisits: 0, totalConversions: 0, conversionRate: 0, daily: [] }
      });
    }
  }
  next();
});

router.get('/example', exampleController.getExample);
router.use('/auth', authRoutes);
router.use('/payment', paymentRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);
router.use('/products', productRoutes);
router.use('/collections', collectionRoutes);
router.use('/products/stocks', stockRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/user', userRoutes);
router.use('/coupons', couponRoutes);

export default router;
