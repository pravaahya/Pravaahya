import { Request, Response } from 'express';
import Collection from '../models/collection.model';
import Product from '../models/product.model';

export const createCollection = async (req: Request, res: Response): Promise<void> => {
   try {
     const { name, description } = req.body;
     let products = req.body.products;
     
     if (!name) {
         res.status(400).json({ error: "Validation Error: Collection name is mandatory." });
         return;
     }

     if (typeof products === 'string') {
        try { products = JSON.parse(products); } catch (e) { products = []; }
     }
     if (!Array.isArray(products)) products = [];

     const imageFiles = req.files as Express.Multer.File[];
     let image = "";
     if (imageFiles && imageFiles.length > 0) {
         const baseUrl = `${req.protocol}://${req.get('host')}`;
         image = `${baseUrl}/uploads/${imageFiles[0].filename}`;
     }

     const newCollection = await Collection.create({
         name, description, image, products
     });
     
     res.status(201).json({ success: true, data: newCollection });
   } catch (err: any) {
     if (err.code === 11000) {
        res.status(400).json({ error: "Validation Error: Collection name already exists." });
        return;
     }
     res.status(500).json({ error: err.message });
   }
};

export const getCollections = async (req: Request, res: Response): Promise<void> => {
   try {
     // Populate products natively so frontend gets robust arrays gracefully
     const collections = await Collection.find().populate('products').sort({ createdAt: -1 });
     res.status(200).json({ success: true, data: collections });
   } catch (err: any) {
     res.status(500).json({ error: err.message });
   }
};

export const getCollection = async (req: Request, res: Response): Promise<void> => {
   try {
     const collection = await Collection.findById(req.params.id).populate('products');
     if (!collection) { 
         res.status(404).json({ error: "Record not found against payload." }); 
         return; 
     }
     res.status(200).json({ success: true, data: collection });
   } catch (err: any) {
     res.status(500).json({ error: err.message });
   }
};

export const updateCollection = async (req: Request, res: Response): Promise<void> => {
   try {
     let updateData: any = { ...req.body };
     
     if (updateData.products && typeof updateData.products === 'string') {
        try { updateData.products = JSON.parse(updateData.products); } catch (e) { delete updateData.products; }
     }
     
     const imageFiles = req.files as Express.Multer.File[];
     if (imageFiles && imageFiles.length > 0) {
         const baseUrl = `${req.protocol}://${req.get('host')}`;
         updateData.image = `${baseUrl}/uploads/${imageFiles[0].filename}`;
     }

     const collection = await Collection.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).populate('products');
     
     if (!collection) { 
         res.status(404).json({ error: "Record not found against payload." }); 
         return; 
     }
     
     res.status(200).json({ success: true, data: collection });
   } catch (err: any) {
     if (err.code === 11000) {
        res.status(400).json({ error: "Validation Error: Collection name already exists." });
        return;
     }
     res.status(500).json({ error: err.message });
   }
};

export const deleteCollection = async (req: Request, res: Response): Promise<void> => {
   try {
     const collection = await Collection.findByIdAndDelete(req.params.id);
     
     if (!collection) { 
         res.status(404).json({ error: "Record not found against payload." }); 
         return; 
     }
     
     res.status(200).json({ success: true, message: "Asset definitively obliterated from logical matrix." });
   } catch (err: any) {
     res.status(500).json({ error: err.message });
   }
};
