import cron from "node-cron";
import { checkLowStock } from "../utils/stockChecker";

// Run autonomously every 15 minutes natively checking DB bounds
export const startStockAlertCron = () => {
   cron.schedule("*/15 * * * *", async () => {
      console.log("[Cron:System] Executing logical threshold scan across active product inventory...");
      const lowStock = await checkLowStock();
      if (lowStock.length > 0) {
         console.warn(`[Cron:System] ALERT! Detected ${lowStock.length} items reaching critical depletion constraints!`);
      }
   });
};
