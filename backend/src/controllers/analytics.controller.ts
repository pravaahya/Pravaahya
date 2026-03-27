import { Request, Response } from 'express';
import Analytics from '../models/analytics.model';

export class AnalyticsController {
  public getSummary = async (req: Request, res: Response): Promise<void> => {
     try {
        // Collect last 30 days securely mapping structural graphs sequentially
        const data = await Analytics.find().sort({ date: -1 }).limit(30);
        
        let totalVisits = 0;
        let totalConversions = 0;
        
        data.forEach(d => {
           totalVisits += d.visits;
           totalConversions += d.conversions;
        });

        const conversionRate = totalVisits > 0 
            ? ((totalConversions / totalVisits) * 100).toFixed(2) 
            : "0.00";

        res.status(200).json({
           success: true,
           data: {
              totalVisits,
              totalConversions,
              conversionRate,
              daily: data.reverse() // Sort ascending for charts natively
           }
        });
     } catch (err: any) {
        res.status(500).json({ error: "Internal aggregation error processing matrices." });
     }
  }
}
