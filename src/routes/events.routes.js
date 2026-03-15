const express = require('express');
const eventController = require('../controllers/events.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const validate = require('../middleware/validation.middleware');
const {
  createEventSchema,
  updateEventSchema,
  getEventSchema,
  listEventsSchema,
} = require('../validators/event.schema');

const router = express.Router();

router.get('/', validate(listEventsSchema), eventController.getAllEvents);
router.get('/:id', validate(getEventSchema), eventController.getEventById);

// Organizer routes
router.use(authMiddleware);
router.use(roleMiddleware('ORGANIZER'));

router.post('/', validate(createEventSchema), eventController.createEvent);
router.put('/:id', validate(updateEventSchema), eventController.updateEvent);
router.delete('/:id', validate(getEventSchema), eventController.deleteEvent);

module.exports = router;
