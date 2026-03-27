import { Response } from 'express';
import User from '../models/user.model';
import Order from '../models/order.model';
import { AuthRequest } from '../middleware/auth.middleware';

export class UserController {
  public getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { userId, phone, email } = req.user as any;
      
      let user = null;
      if (userId) {
         user = await User.findById(userId).select('-__v');
      } else if (email) {
         user = await User.findOne({ email }).select('-__v');
      } else if (phone) {
         user = await User.findOne({ phone }).select('-__v');
      }

      if (!user) {
         if (phone) {
            res.status(200).json({ success: true, data: { phone, email: '', name: '' } });
            return;
         }
         res.status(404).json({ error: 'User not found' });
         return;
      }
      
      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  public updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { userId, phone, email } = req.user as any;
      const { name, phone: newPhone } = req.body;
      
      let user = null;
      if (userId) user = await User.findById(userId);
      else if (email) user = await User.findOne({ email });
      else if (phone) user = await User.findOne({ phone });

      if (!user) {
         res.status(400).json({ error: 'Legacy profiles cannot be updated directly. Please log out and securely log back in with an Email Identifier.' });
         return;
      }

      user.name = name;
      user.phone = newPhone;
      await user.save();

      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  public getUserOrders = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const orders = await Order.find({ userId }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: orders });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
