import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  name?: string;
  phone?: string;
  isVerified: boolean;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String },
  phone: { type: String },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<IUser>("User", UserSchema);
