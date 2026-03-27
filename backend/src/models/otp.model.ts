import mongoose, { Schema, Document } from "mongoose";

export interface IOtp extends Document {
  phone?: string;
  email?: string;
  otpHash: string;
  attempts: number;
  expiresAt: Date;
}

const OtpSchema: Schema = new Schema({
  phone: {
    type: String,
    index: true,
  },
  email: {
    type: String,
    index: true,
  },
  otpHash: {
    type: String,
    required: true,
  },
  attempts: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    required: true,
    expires: 0
  }
}, { timestamps: true });

export default mongoose.model<IOtp>("Otp", OtpSchema);
