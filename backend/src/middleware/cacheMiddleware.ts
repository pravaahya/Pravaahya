import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis';

export const cache = (keyPrefix: string, ttl: number) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!redisClient.isReady) {
                return next();
            }

            const key = `${keyPrefix}:${req.originalUrl || req.url}`;
            const cachedData = await redisClient.get(key);

            if (cachedData) {
                res.status(200).json(JSON.parse(cachedData));
                return;
            }

            const originalJson = res.json.bind(res);
            res.json = (body: any): Response => {
                redisClient.setEx(key, ttl, JSON.stringify(body)).catch(console.error);
                return originalJson(body);
            };

            next();
        } catch (error) {
            console.error('Cache Intercept Error:', error);
            next();
        }
    };
};
