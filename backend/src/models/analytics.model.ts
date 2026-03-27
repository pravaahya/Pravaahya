import mongoose, { Schema, Document } from "mongoose";

export interface IAnalytics extends Document {
  date: Date;
  visits: number;
  conversions: number;
}

const AnalyticsSchema = new Schema({
  date: { type: Date, required: true, unique: true },
  visits: { type: Number, default: 0 },
  conversions: { type: Number, default: 0 }
});

export default mongoose.model<IAnalytics>("Analytics", AnalyticsSchema);
