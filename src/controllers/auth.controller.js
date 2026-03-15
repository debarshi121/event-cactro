const authService = require('../services/auth.service');
const logger = require('../utils/logger');

class AuthController {
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login(email, password);
      res.status(200).json({
        status: 'success',
        data: { user, token },
      });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      // req.user will be populated by auth middleware
      const { password, ...userWithoutPassword } = req.user;
      res.status(200).json({
        status: 'success',
        data: { user: userWithoutPassword },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
