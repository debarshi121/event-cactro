const express = require('express');
const bookingController = require('../controllers/bookings.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const validate = require('../middleware/validation.middleware');
const {
  createBookingSchema,
  getMyBookingsSchema,
  getEventBookingsSchema,
} = require('../validators/booking.schema');

const router = express.Router();

router.use(authMiddleware);

router.post('/', roleMiddleware('CUSTOMER'), validate(createBookingSchema), bookingController.createBooking);
router.get('/my', roleMiddleware('CUSTOMER'), validate(getMyBookingsSchema), bookingController.getMyBookings);
router.get('/event/:eventId', roleMiddleware('ORGANIZER'), validate(getEventBookingsSchema), bookingController.getEventBookings);

module.exports = router;
