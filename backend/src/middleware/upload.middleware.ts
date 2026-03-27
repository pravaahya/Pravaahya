import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Assure local directory logic blocks exist dynamically natively
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); 
    },
    filename: function (req, file, cb) {
        // Prevent collisions explicitly via UTC native hashes
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); 
    }
});

export const uploadFiles = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB cap structurally
});
