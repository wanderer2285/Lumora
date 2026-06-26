const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Middleware to validate registration input
 */
exports.validateRegister = (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: email, password, firstName, lastName'
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters'
    });
  }

  if (firstName.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'firstName must be at least 2 characters'
    });
  }

  if (lastName.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'lastName must be at least 2 characters'
    });
  }

  next();
};

/**
 * Middleware to validate login input
 */
exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }

  next();
};