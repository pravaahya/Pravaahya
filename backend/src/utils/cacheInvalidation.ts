import redisClient from '../config/redis';

export const clearCache = async (prefix: string) => {
    try {
        if (!redisClient.isReady) return;
        
        const keys = await redisClient.keys(`${prefix}*`);
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
    } catch (error) {
        console.error('Cache Invalidation Extinction Error:', error);
    }
};
