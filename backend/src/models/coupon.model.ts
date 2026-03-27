import mongoose, { Schema, Document } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  discountPercentage: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema: Schema = new Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is strictly required."],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: [3, "Code must be at least 3 characters."],
    },
    discountPercentage: {
      type: Number,
      required: [true, "Percentage mapping is required."],
      min: [1, "Discount cannot be conceptually lower than 1%."],
      max: [100, "Discount cannot logically exceed 100%."],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICoupon>("Coupon", CouponSchema);
