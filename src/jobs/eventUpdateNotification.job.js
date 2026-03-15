const logger = require('../utils/logger');
const eventRepository = require('../repositories/event.repository');
const bookingRepository = require('../repositories/booking.repository');

const eventUpdateNotificationJob = async (data) => {
  const { eventId } = data;
  
  const event = await eventRepository.findById(eventId);
  if (!event) {
    logger.error(`Event ${eventId} not found for notification`);
    return;
  }

  const bookings = await bookingRepository.findByEventId(eventId);
  
  // Get unique customers
  const customers = Array.from(new Set(bookings.map(b => b.customer.email)));

  for (const email of customers) {
    // Simulate sending notification
    console.log(`Notification sent to ${email}: Event "${event.title}" has been updated.`);
    logger.info(`Event update notification sent to ${email}`);
  }
};

module.exports = eventUpdateNotificationJob;
