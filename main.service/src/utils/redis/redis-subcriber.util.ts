import { Redis } from 'ioredis';
const url = process.env.REDIS_URL || 'redis://localhost:6379';

const redisSubscriber = new Redis(url); // For pub sub
export default redisSubscriber;
