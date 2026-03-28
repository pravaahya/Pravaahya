"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCollection = exports.updateCollection = exports.getCollection = exports.getCollections = exports.createCollection = void 0;
const collection_model_1 = __importDefault(require("../models/collection.model"));
const createCollection = async (req, res) => {
    try {
        const { name, description } = req.body;
        let products = req.body.products;
        if (!name) {
            res.status(400).json({ error: "Validation Error: Collection name is mandatory." });
            return;
        }
        if (typeof products === 'string') {
            try {
                products = JSON.parse(products);
            }
            catch (e) {
                products = [];
            }
        }
        if (!Array.isArray(products))
            products = [];
        const imageFiles = req.files;
        let image = "";
        if (imageFiles && imageFiles.length > 0) {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            image = `${baseUrl}/uploads/${imageFiles[0].filename}`;
        }
        const newCollection = await collection_model_1.default.create({
            name, description, image, products
        });
        res.status(201).json({ success: true, data: newCollection });
    }
    catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ error: "Validation Error: Collection name already exists." });
            return;
        }
        res.status(500).json({ error: err.message });
    }
};
exports.createCollection = createCollection;
const getCollections = async (req, res) => {
    try {
        // Populate products natively so frontend gets robust arrays gracefully
        const collections = await collection_model_1.default.find().populate('products').sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: collections });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getCollections = getCollections;
const getCollection = async (req, res) => {
    try {
        const collection = await collection_model_1.default.findById(req.params.id).populate('products');
        if (!collection) {
            res.status(404).json({ error: "Record not found against payload." });
            return;
        }
        res.status(200).json({ success: true, data: collection });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getCollection = getCollection;
const updateCollection = async (req, res) => {
    try {
        let updateData = { ...req.body };
        if (updateData.products && typeof updateData.products === 'string') {
            try {
                updateData.products = JSON.parse(updateData.products);
            }
            catch (e) {
                delete updateData.products;
            }
        }
        const imageFiles = req.files;
        if (imageFiles && imageFiles.length > 0) {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            updateData.image = `${baseUrl}/uploads/${imageFiles[0].filename}`;
        }
        const collection = await collection_model_1.default.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).populate('products');
        if (!collection) {
            res.status(404).json({ error: "Record not found against payload." });
            return;
        }
        res.status(200).json({ success: true, data: collection });
    }
    catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ error: "Validation Error: Collection name already exists." });
            return;
        }
        res.status(500).json({ error: err.message });
    }
};
exports.updateCollection = updateCollection;
const deleteCollection = async (req, res) => {
    try {
        const collection = await collection_model_1.default.findByIdAndDelete(req.params.id);
        if (!collection) {
            res.status(404).json({ error: "Record not found against payload." });
            return;
        }
        res.status(200).json({ success: true, message: "Asset definitively obliterated from logical matrix." });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteCollection = deleteCollection;
