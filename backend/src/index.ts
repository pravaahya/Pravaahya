import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { trackVisit } from './middleware/trackVisit.middleware';
import routes from './routes/index';
import { connectDB } from './config/db';
import { startStockAlertCron } from './cron/stockAlertJob';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({ crossOriginResourcePolicy: false })); // Permitting cross-origin fetching for public image directory dynamically
app.use(cors());
app.use(express.json());

// Serve static dynamic product imagery structurally tracking local disks
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use('/api', trackVisit, routes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

app.get('/admin', (req, res) => {
  // If the user attempts reaching the API's port for the UI interface natively
  res.redirect('http://localhost:3000/admin/login');
});

app.listen(PORT, () => {
   console.log(`Server successfully secured and running dynamically on native port ${PORT}`);
   
   // Formulate independent automated Cron jobs executing entirely decoupled from router proxy
   startStockAlertCron(); 
});

connectDB().catch((err) => {
   console.error("FATAL: MongoDB connection rejected organically.", err);
});

// Force clean nodemon restart explicitly bridging network timeouts smartly cleanly securely
// Second forced restart successfully capturing Active 0.0.0.0 bounds naturally cleanly
// Third forced restart executed via Antigravity to autonomously reboot port 5000 gracefully.
