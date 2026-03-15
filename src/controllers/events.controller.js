const eventService = require('../services/event.service');

class EventController {
  async createEvent(req, res, next) {
    try {
      const event = await eventService.createEvent(req.body, req.user.id);
      res.status(201).json({
        status: 'success',
        data: { event },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllEvents(req, res, next) {
    try {
      const { events, total } = await eventService.getAllEvents(req.query);
      res.status(200).json({
        status: 'success',
        results: events.length,
        total,
        data: { events },
      });
    } catch (error) {
      next(error);
    }
  }

  async getEventById(req, res, next) {
    try {
      const event = await eventService.getEventById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: { event },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateEvent(req, res, next) {
    try {
      const event = await eventService.updateEvent(req.params.id, req.body, req.user.id);
      res.status(200).json({
        status: 'success',
        data: { event },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteEvent(req, res, next) {
    try {
      await eventService.deleteEvent(req.params.id, req.user.id);
      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EventController();
