const { z } = require('zod');

const createBookingSchema = z.object({
  body: z.object({
    eventId: z.string().uuid('Invalid event ID'),
    quantity: z.number().int().positive('Quantity must be at least 1'),
  }),
});

const getMyBookingsSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val) : 10)),
  }),
});

const getEventBookingsSchema = z.object({
  params: z.object({
    eventId: z.string().uuid('Invalid event ID'),
  }),
});

module.exports = {
  createBookingSchema,
  getMyBookingsSchema,
  getEventBookingsSchema,
};
