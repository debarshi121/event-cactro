const { Worker } = require('bullmq');
const { redisConfig } = require('../config/redis');
const logger = require('../utils/logger');
const bookingConfirmationJob = require('../jobs/bookingConfirmation.job');

const bookingWorker = new Worker('bookingQueue', async (job) => {
  logger.info(`Processing booking job ${job.id}`);
  await bookingConfirmationJob(job.data);
}, {
  connection: redisConfig,
});

bookingWorker.on('completed', (job) => {
  logger.info(`Booking job ${job.id} completed`);
});

bookingWorker.on('failed', (job, err) => {
  logger.error(`Booking job ${job.id} failed: ${err.message}`);
});

module.exports = bookingWorker;
