import { Request, Response, NextFunction } from 'express';
import Analytics from '../models/analytics.model';
import mongoose from 'mongoose';

export const trackVisit = async (req: Request, res: Response, next: NextFunction) => {
   try {
      // Instantly drop tracking if network is rejecting IP
      if (mongoose.connection.readyState !== 1) return next();

      // Only track GET requests to public endpoints to avoid spamming internal admin bounds
      if (req.method === 'GET' && !req.path.includes('/admin') && !req.path.includes('/analytics')) {
         const today = new Date();
         today.setUTCHours(0, 0, 0, 0); // Normalize boundaries globally

         await Analytics.findOneAndUpdate(
            { date: today },
            { $inc: { visits: 1 } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
         );
      }
   } catch (error) {
      console.error("[Analytics] Background tracking failed silently.", error);
   }
   next();
};
