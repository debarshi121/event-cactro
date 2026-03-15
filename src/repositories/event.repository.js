const prisma = require('../config/prisma');

class EventRepository {
  async findById(id) {
    return prisma.event.findUnique({
      where: { id },
      include: { organizer: { select: { id: true, name: true, email: true } } },
    });
  }

  async findAll(filters) {
    const { skip, take, location, date } = filters;
    const where = {};
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(searchDate.getDate() + 1);
      where.eventDate = {
        gte: searchDate,
        lt: nextDay,
      };
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take,
        orderBy: { eventDate: 'asc' },
        include: { organizer: { select: { id: true, name: true, email: true } } },
      }),
      prisma.event.count({ where }),
    ]);

    return { events, total };
  }

  async create(eventData) {
    return prisma.event.create({
      data: eventData,
    });
  }

  async update(id, eventData) {
    return prisma.event.update({
      where: { id },
      data: eventData,
    });
  }

  async delete(id) {
    return prisma.event.delete({
      where: { id },
    });
  }
}

module.exports = new EventRepository();
