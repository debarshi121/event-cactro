const eventRepository = require('../repositories/event.repository');
const { ApiError } = require('../middleware/error.middleware');
const notificationQueue = require('../queues/notification.queue');

class EventService {
  async createEvent(eventData, organizerId) {
    const formattedData = {
      ...eventData,
      eventDate: new Date(eventData.eventDate),
      availableTickets: eventData.totalTickets,
      organizerId,
    };
    return eventRepository.create(formattedData);
  }

  async getAllEvents(filters) {
    const { page = 1, limit = 10, location, date } = filters;
    const skip = (page - 1) * limit;
    const take = limit;

    return eventRepository.findAll({ skip, take, location, date });
  }

  async getEventById(id) {
    const event = await eventRepository.findById(id);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }
    return event;
  }

  async updateEvent(id, eventData, userId) {
    const event = await this.getEventById(id);
    
    if (event.organizerId !== userId) {
      throw new ApiError(403, 'You are not authorized to update this event');
    }

    const formattedData = { ...eventData };
    if (eventData.eventDate) formattedData.eventDate = new Date(eventData.eventDate);
    
    // If totalTickets is updated, adjust availableTickets? 
    // For simplicity, let's assume totalTickets change doesn't automatically affect availableTickets for existing bookings, 
    // but in a real-world scenario we'd need more logic.
    
    const updatedEvent = await eventRepository.update(id, formattedData);

    await notificationQueue.add('notify', { eventId: id });

    return updatedEvent;
  }

  async deleteEvent(id, userId) {
    const event = await this.getEventById(id);
    
    if (event.organizerId !== userId) {
      throw new ApiError(403, 'You are not authorized to delete this event');
    }

    return eventRepository.delete(id);
  }
}

module.exports = new EventService();
