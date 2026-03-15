const { Queue } = require('bullmq');
const { redisConfig } = require('../config/redis');

const bookingQueue = new Queue('bookingQueue', {
  connection: redisConfig,
});

module.exports = bookingQueue;
