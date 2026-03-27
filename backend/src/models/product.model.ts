import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  category: string;
  tags: string[];
  images: string[];
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters long"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [10, "Product description must be at least 10 characters long"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Product price cannot be negative"],
    },
    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: [0, "Product stock cannot be negative"],
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: [1, "Threshold must be at least 1"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, "Product tags are required"],
      validate: {
        validator: function (v: string[]) {
          return Array.isArray(v) && v.length > 0 && v.every((tag) => typeof tag === "string" && tag.trim().length > 0);
        },
        message: "Tags array cannot be empty, and each tag must be a non-empty string.",
      },
      default: undefined, // Ensures required check applies if missing completely
    },
    images: {
      type: [String],
      required: [true, "Images are required"],
      validate: {
        validator: function (v: string[]) {
          return Array.isArray(v) && v.length > 0 && v.every((img) => typeof img === "string" && img.trim().length > 0);
        },
        message: "Images array cannot be empty. All image paths must be structurally active strings.",
      },
      default: undefined,
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

export default mongoose.model<IProduct>("Product", ProductSchema);
