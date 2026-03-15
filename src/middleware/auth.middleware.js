const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const { ApiError } = require('./error.middleware');

const authMiddleware = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ApiError(401, 'You are not logged in! Please log in to get access.'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await userRepository.findById(decoded.id);
    if (!currentUser) {
      return next(new ApiError(401, 'The user belonging to this token no longer exists.'));
    }

    req.user = currentUser;
    next();
  } catch (error) {
    next(new ApiError(401, 'Invalid token. Please log in again!'));
  }
};

module.exports = authMiddleware;
