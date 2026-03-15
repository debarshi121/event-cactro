const bookingService = require('../services/booking.service');

class BookingController {
  async createBooking(req, res, next) {
    try {
      const booking = await bookingService.createBooking(req.body, req.user.id);
      res.status(201).json({
        status: 'success',
        data: { booking },
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyBookings(req, res, next) {
    try {
      const { bookings, total } = await bookingService.getMyBookings(req.user.id, req.query);
      res.status(200).json({
        status: 'success',
        results: bookings.length,
        total,
        data: { bookings },
      });
    } catch (error) {
      next(error);
    }
  }

  async getEventBookings(req, res, next) {
    try {
      const bookings = await bookingService.getEventBookings(
        req.params.eventId,
        req.user.id,
        req.user.role
      );
      res.status(200).json({
        status: 'success',
        results: bookings.length,
        data: { bookings },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookingController();
