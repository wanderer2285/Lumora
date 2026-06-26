const express = require('express');
const authController = require('../controllers/authController');
const authValidation = require('../middleware/authValidation');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * POST /auth/register
 * Register a new user
 * Body: { email, password, firstName, lastName }
 */

router.post(
  '/register',
  authValidation.validateRegister,
  authController.register
);

/**
 * POST /auth/login
 * Login user and return user details
 * Body: { email, password }
 */
router.post(
  '/login',
  authValidation.validateLogin,
  authController.login
);

router.get(
  '/me',
  authMiddleware.verifyToken,
  (req, res) => {
    res.json({
      success: true,
      user: req.user
    });
  }
);

module.exports = router;