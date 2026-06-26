/**
 * Validate create course input
 */
exports.validateCreateCourse = (req, res, next) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: 'Title and description are required'
    });
  }

  if (typeof title !== 'string' || title.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: 'Title must be a string with at least 3 characters'
    });
  }

  if (typeof description !== 'string' || description.trim().length < 10) {
    return res.status(400).json({
      success: false,
      message: 'Description must be a string with at least 10 characters'
    });
  }

  if (req.body.price !== undefined && (isNaN(req.body.price) || req.body.price < 0)) {
    return res.status(400).json({
      success: false,
      message: 'Price must be a non-negative number'
    });
  }

  next();
};

/**
 * Validate update course input
 */
exports.validateUpdateCourse = (req, res, next) => {
  const { title, description, price } = req.body;

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Title must be a string with at least 3 characters'
      });
    }
  }

  if (description !== undefined) {
    if (typeof description !== 'string' || description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Description must be a string with at least 10 characters'
      });
    }
  }

  if (price !== undefined) {
    if (isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a non-negative number'
      });
    }
  }

  next();
};