import { Request, Response } from 'express';
import User from '../models/user.model';
import Order from '../models/order.model';
import { AuthRequest } from '../middleware/auth.middleware';

export class AdminController {
  public getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      // Fetch all users and use aggregation to count their orders securely
      const users = await User.find().select('-__v').sort({ createdAt: -1 });
      
      const usersWithOrderCount = await Promise.all(
         users.map(async (user) => {
            const count = await Order.countDocuments({ userId: user._id });
            return { ...user.toObject(), totalOrders: count };
         })
      );
      
      res.status(200).json({ success: true, data: usersWithOrderCount });
    } catch (error: any) {
      res.status(500).json({ error: "Internal Gateway Encryption Block Error" });
    }
  };

  public getUserDetails = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await User.findById(id).select('-__v');
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const orders = await Order.find({ userId: id }).sort({ createdAt: -1 });

      res.status(200).json({ success: true, data: { user, orders } });
    } catch (error: any) {
      res.status(500).json({ error: "Internal Gateway Encryption Block Error" });
    }
  };
}
