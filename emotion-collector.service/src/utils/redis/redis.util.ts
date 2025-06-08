import { Redis } from 'ioredis';
const url = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(url); // For cache
export default redis;
