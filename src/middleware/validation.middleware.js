const { ApiError } = require('./error.middleware');

const validate = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    req.body = validated.body;
    req.query = validated.query;
    req.params = validated.params;
    next();
  } catch (error) {
    const message = error.errors.map((err) => err.message).join(', ');
    next(new ApiError(400, message));
  }
};

module.exports = validate;
