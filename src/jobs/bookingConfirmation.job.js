const logger = require('../utils/logger');
const bookingRepository = require('../repositories/booking.repository');

const bookingConfirmationJob = async (data) => {
  const { bookingId } = data;
  
  // In a real app, we'd fetch booking details and user email
  const booking = await bookingRepository.findById(bookingId);
  if (!booking) {
    logger.error(`Booking ${bookingId} not found for notification`);
    return;
  }

  // Simulate sending email
  console.log(`Booking confirmation email sent to ${booking.customer.email} for event "${booking.event.title}".`);
  logger.info(`Booking confirmation email sent to ${booking.customer.email}`);
};

module.exports = bookingConfirmationJob;
