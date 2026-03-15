const Redis = require('ioredis');
const logger = require('../utils/logger');

const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  // Enable TLS for cloud providers like Upstash (required for rediss://)
  tls: process.env.REDIS_PASSWORD ? {} : undefined,
};

const connection = new Redis(redisConfig);

connection.on('connect', () => {
  logger.info('Connected to Redis');
});

connection.on('error', (err) => {
  logger.error(`Redis connection error: ${err.message}`);
});

module.exports = { connection, redisConfig };
