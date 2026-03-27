import { connectDB } from './src/config/db';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
connectDB().then(() => {
  console.log('Test Complete');
  process.exit(0);
}).catch((e) => {
  console.error('Test Failed', e);
  process.exit(1);
});
