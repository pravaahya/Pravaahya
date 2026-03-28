"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ProductSchema = new mongoose_1.Schema({
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
            validator: function (v) {
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
            validator: function (v) {
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
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Product", ProductSchema);
