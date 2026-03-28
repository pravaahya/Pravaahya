"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkLowStock = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const checkLowStock = async () => {
    try {
        // Utilize MongoDB explicit aggregation pipelines organically parsing thresholds
        const lowStockProducts = await product_model_1.default.aggregate([
            {
                $match: {
                    $expr: {
                        $lte: ["$stock", "$lowStockThreshold"]
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    stock: 1,
                    lowStockThreshold: 1,
                    category: 1
                }
            }
        ]);
        return lowStockProducts;
    }
    catch (error) {
        console.error("[StockChecker] Fatal analysis failure:", error);
        return [];
    }
};
exports.checkLowStock = checkLowStock;
