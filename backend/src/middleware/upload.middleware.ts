import multer from 'multer';

// Vercel Serverless functions inherently block local OS disk-writes (EROFS).
// Bypassing to RAM Buffers natively for direct Database Base64 ingestion.
const storage = multer.memoryStorage();

export const uploadFiles = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB cap structurally
});
