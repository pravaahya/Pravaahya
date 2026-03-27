import Analytics from '../models/analytics.model';

export const trackConversion = async () => {
   try {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      await Analytics.findOneAndUpdate(
         { date: today },
         { $inc: { conversions: 1 } },
         { upsert: true, new: true, setDefaultsOnInsert: true }
      );
   } catch (error) {
      console.error("[Analytics] Conversion logging natively failed:", error);
   }
};
