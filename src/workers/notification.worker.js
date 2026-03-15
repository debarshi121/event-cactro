const { Worker } = require('bullmq');
const { redisConfig } = require('../config/redis');
const logger = require('../utils/logger');
const eventUpdateNotificationJob = require('../jobs/eventUpdateNotification.job');

const notificationWorker = new Worker('notificationQueue', async (job) => {
  logger.info(`Processing notification job ${job.id}`);
  await eventUpdateNotificationJob(job.data);
}, {
  connection: redisConfig,
});

notificationWorker.on('completed', (job) => {
  logger.info(`Notification job ${job.id} completed`);
});

notificationWorker.on('failed', (job, err) => {
  logger.error(`Notification job ${job.id} failed: ${err.message}`);
});

module.exports = notificationWorker;
