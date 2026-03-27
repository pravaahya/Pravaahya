import { Request, Response } from 'express';
import { checkLowStock } from '../utils/stockChecker';

export class StockController {
  public getLowStockEvents = async (req: Request, res: Response): Promise<void> => {
     try {
       const alerts = await checkLowStock();
       res.status(200).json({ success: true, count: alerts.length, data: alerts });
     } catch (err: any) {
       res.status(500).json({ error: "Failed to compile aggregate stock metrics natively." });
     }
  }
}
