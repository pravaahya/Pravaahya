import { Router, Response } from 'express';
import mongoose from 'mongoose';
import { protect, adminOnly, AuthRequest } from '../middleware/auth.middleware';

import Order from '../models/order.model';

import { AdminController } from '../controllers/admin.controller';

const router = Router();
const adminController = new AdminController();

router.get('/users', protect, adminOnly, adminController.getUsers);
router.get('/users/:id', protect, adminOnly, adminController.getUserDetails);

// Global router interceptor for offline resilience bridging database authentication constraints.
// Route protected by both middlewares serving analytical arrays dynamically
router.get('/insights', protect, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find();
    let totalRevenue = 0;
    const monthlyOrders = new Array(12).fill(0);
    const monthlyRevenue = new Array(12).fill(0);

    orders.forEach(order => {
       const status = order.status?.toUpperCase() || '';
       if (status !== 'PENDING' && status !== 'CANCELLED' && status !== 'FAILED') {
          totalRevenue += (order.total || 0);
       }
       
       // Log volumes regardless of payment status to predict intent correctly
       if (order.createdAt) {
          const month = new Date(order.createdAt).getMonth();
          monthlyOrders[month] += 1;
          if (status !== 'PENDING' && status !== 'CANCELLED' && status !== 'FAILED') {
             monthlyRevenue[month] += (order.total || 0);
          }
       }
    });

    res.status(200).json({
      success: true,
      data: {
        totalOrders: orders.length,
        totalRevenue,
        totalUsers: await import('../models/user.model').then(m => m.default.countDocuments()),
        monthlyOrders,
        monthlyRevenue
      }
    });
  } catch (error) {
    console.error("INSIGHTS CRASH:", error);
    res.status(500).json({ success: false, error: "Hardware aggregation constraint failure.", trace: (error as any)?.message || String(error) });
  }
});

export default router;
