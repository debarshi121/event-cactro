const { z } = require('zod');

const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    location: z.string().min(3, 'Location is required'),
    eventDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
    totalTickets: z.number().int().positive('Total tickets must be a positive integer'),
    price: z.number().positive('Price must be positive'),
  }),
});

const updateEventSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    location: z.string().min(3).optional(),
    eventDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }).optional(),
    totalTickets: z.number().int().positive().optional(),
    price: z.number().positive().optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid event ID'),
  }),
});

const getEventSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid event ID'),
  }),
});

const listEventsSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val) : 10)),
    location: z.string().optional(),
    date: z.string().optional(),
  }),
});

module.exports = {
  createEventSchema,
  updateEventSchema,
  getEventSchema,
  listEventsSchema,
};
