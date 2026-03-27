import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  user: {
    name: string;
    email: string;
    phone: string;
    address: {
      houseNo: string;
      streetArea: string;
      landmark?: string;
      cityVillage: string;
      district: string;
      state: string;
      country: string;
      pincode: string;
    } | any; // Any fallback permits robust backwards compatibility implicitly against legacy string variants natively without throwing runtime cast exceptions natively. 
  };
  userId?: mongoose.Types.ObjectId;
  products: {
    product: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  paymentId?: string;
  razorpayOrderId?: string;
  status: "PENDING" | "PAID" | "FAILED" | "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  statusHistory?: { status: string; timestamp: Date }[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema({
  user: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { 
      type: Schema.Types.Mixed,
      required: true 
    }
  },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  products: [{
    product: { type: String, required: true }, 
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  paymentId: { type: String },
  razorpayOrderId: { type: String, index: true },
  status: { type: String, enum: ["PENDING", "PAID", "FAILED", "pending", "paid", "processing", "shipped", "delivered", "cancelled"], default: "pending" },
  statusHistory: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model<IOrder>("Order", OrderSchema);
