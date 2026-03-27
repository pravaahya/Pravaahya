import { createClient } from 'redis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));

redisClient.connect().then(() => {
    console.log('Redis Cluster Connected Securely.');
}).catch(console.error);

export default redisClient;
