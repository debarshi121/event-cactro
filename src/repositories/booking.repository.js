const prisma = require('../config/prisma');

class BookingRepository {
  async findById(id) {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        event: true,
        customer: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findByCustomerId(customerId, skip, take) {
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where: { customerId },
        skip,
        take,
        orderBy: { bookingDate: 'desc' },
        include: { event: true },
      }),
      prisma.booking.count({ where: { customerId } }),
    ]);

    return { bookings, total };
  }

  async findByEventId(eventId) {
    return prisma.booking.findMany({
      where: { eventId },
      include: { customer: { select: { id: true, name: true, email: true } } },
    });
  }

  async createWithTransaction(bookingData) {
    const { eventId, customerId, quantity, totalPrice } = bookingData;

    return prisma.$transaction(async (tx) => {
      // 1. Get event and lock it (Prisma doesn't have native FOR UPDATE without raw SQL, 
      // but we can use interactive transactions and check availability)
      const event = await tx.event.findUnique({
        where: { id: eventId },
      });

      if (!event) {
        throw new Error('Event not found');
      }

      if (event.availableTickets < quantity) {
        throw new Error('Not enough tickets available');
      }

      // 2. Reduce available tickets
      await tx.event.update({
        where: { id: eventId },
        data: {
          availableTickets: {
            decrement: quantity,
          },
        },
      });

      // 3. Create booking
      const booking = await tx.booking.create({
        data: {
          eventId,
          customerId,
          quantity,
          totalPrice,
          status: 'CONFIRMED',
        },
        include: { event: true, customer: true },
      });

      return booking;
    });
  }
}

module.exports = new BookingRepository();
