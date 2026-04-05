"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.getProducts = exports.createProduct = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const cacheInvalidation_1 = require("../utils/cacheInvalidation");
const createProduct = async (req, res) => {
    try {
        const { name, price, description, stock, category = "General", tags = ["Eco"], isFeatured } = req.body;
        if (!name || isNaN(price) || !description || isNaN(stock)) {
            res.status(400).json({ error: "Validation Error: Core parameter attributes are universally mandatory." });
            return;
        }
        if (Number(price) <= 0 || Number(stock) < 0) {
            res.status(400).json({ error: "Validation Error: Price must be strictly > 0 and stock >= 0." });
            return;
        }
        const imageFiles = req.files;
        let images = [];
        if (imageFiles && imageFiles.length > 0) {
            images = imageFiles.map(file => {
                const base64 = file.buffer.toString('base64');
                return `data:${file.mimetype};base64,${base64}`;
            });
        }
        if (images.length === 0) {
            res.status(400).json({ error: "Validation Error: Minimum 1 image product binary unconditionally required." });
            return;
        }
        const newProduct = await product_model_1.default.create({
            name, price: Number(price), description, stock: Number(stock), category, tags, images,
            isFeatured: isFeatured === 'true' || isFeatured === true
        });
        await (0, cacheInvalidation_1.clearCache)('products');
        res.status(201).json({ success: true, data: newProduct });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.createProduct = createProduct;
const getProducts = async (req, res) => {
    try {
        const query = {};
        if (req.query.featured === 'true') {
            query.isFeatured = true;
        }
        if (req.query.search) {
            query.name = { $regex: req.query.search, $options: 'i' };
        }
        // Limit for featured products if requested natively
        const limit = req.query.limit ? Number(req.query.limit) : 0;
        let productQuery = product_model_1.default.find(query).sort({ createdAt: -1 });
        if (limit > 0)
            productQuery = productQuery.limit(limit);
        const products = await productQuery;
        res.status(200).json({ success: true, data: products });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getProducts = getProducts;
const getProduct = async (req, res) => {
    try {
        const product = await product_model_1.default.findById(req.params.id);
        if (!product) {
            res.status(404).json({ error: "Record not found against payload." });
            return;
        }
        res.status(200).json({ success: true, data: product });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getProduct = getProduct;
const updateProduct = async (req, res) => {
    try {
        const { name, price, description, stock } = req.body;
        if (price !== undefined && Number(price) <= 0) {
            res.status(400).json({ error: "Validation Error: Price must be strictly > 0." });
            return;
        }
        if (stock !== undefined && Number(stock) < 0) {
            res.status(400).json({ error: "Validation Error: Stock must be strictly >= 0." });
            return;
        }
        let updateData = { ...req.body };
        // Boolean explicit casting for multipart strings structurally
        if (updateData.isFeatured !== undefined) {
            updateData.isFeatured = updateData.isFeatured === 'true' || updateData.isFeatured === true;
        }
        const imageFiles = req.files;
        if (imageFiles && imageFiles.length > 0) {
            updateData.images = imageFiles.map(file => {
                const base64 = file.buffer.toString('base64');
                return `data:${file.mimetype};base64,${base64}`;
            });
        }
        const product = await product_model_1.default.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!product) {
            res.status(404).json({ error: "Record not found against payload." });
            return;
        }
        await (0, cacheInvalidation_1.clearCache)('products');
        res.status(200).json({ success: true, data: product });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const product = await product_model_1.default.findByIdAndDelete(req.params.id);
        if (!product) {
            res.status(404).json({ error: "Record not found against payload." });
            return;
        }
        await (0, cacheInvalidation_1.clearCache)('products');
        res.status(200).json({ success: true, message: "Asset definitively obliterated from logical matrix." });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteProduct = deleteProduct;
