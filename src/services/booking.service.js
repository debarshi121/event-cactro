const bookingRepository = require('../repositories/booking.repository');
const eventRepository = require('../repositories/event.repository');
const { ApiError } = require('../middleware/error.middleware');
const bookingQueue = require('../queues/booking.queue');

class BookingService {
  async createBooking(bookingData, customerId) {
    const { eventId, quantity } = bookingData;

    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    const totalPrice = event.price * quantity;

    try {
      const booking = await bookingRepository.createWithTransaction({
        eventId,
        customerId,
        quantity,
        totalPrice,
      });

      await bookingQueue.add('confirm', { bookingId: booking.id });

      return booking;
    } catch (error) {
      if (error.message === 'Not enough tickets available') {
        throw new ApiError(400, error.message);
      }
      throw error;
    }
  }

  async getMyBookings(customerId, query) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const take = limit;

    return bookingRepository.findByCustomerId(customerId, skip, take);
  }

  async getEventBookings(eventId, userId, role) {
    if (role === 'CUSTOMER') {
        throw new ApiError(403, 'Access denied');
    }
    
    // If ORGANIZER, verify they own the event
    const event = await eventRepository.findById(eventId);
    if (!event) {
        throw new ApiError(404, 'Event not found');
    }

    if (role === 'ORGANIZER' && event.organizerId !== userId) {
        throw new ApiError(403, 'You can only view bookings for your own events');
    }

    return bookingRepository.findByEventId(eventId);
  }
}

module.exports = new BookingService();
