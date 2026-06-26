/**
 * Validate create lesson input
 */
exports.validateCreateLesson = (req, res, next) => {
  const { title, description, content, position, duration, videoUrl } = req.body;

  // Required fields
  if (!title || !description || !content || position === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Title, description, content, and position are required'
    });
  }

  // Validate title
  if (typeof title !== 'string' || title.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: 'Title must be a string with at least 3 characters'
    });
  }

  // Validate description
  if (typeof description !== 'string' || description.trim().length < 10) {
    return res.status(400).json({
      success: false,
      message: 'Description must be a string with at least 10 characters'
    });
  }

  // Validate content
  if (typeof content !== 'string' || content.trim().length < 20) {
    return res.status(400).json({
      success: false,
      message: 'Content must be a string with at least 20 characters'
    });
  }

  // Validate position
  if (typeof position !== 'number' || position < 1 || !Number.isInteger(position)) {
    return res.status(400).json({
      success: false,
      message: 'Position must be a positive integer'
    });
  }

  // Validate optional duration
  if (duration !== undefined && (typeof duration !== 'number' || duration < 1)) {
    return res.status(400).json({
      success: false,
      message: 'Duration must be a positive number (minutes)'
    });
  }

  // Validate optional videoUrl
  if (videoUrl !== undefined && typeof videoUrl !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Video URL must be a string'
    });
  }

  next();
};

/**
 * Validate update lesson input
 */
exports.validateUpdateLesson = (req, res, next) => {
  const { title, description, content, position, duration, videoUrl } = req.body;

  // At least one field must be provided
  if (
    title === undefined &&
    description === undefined &&
    content === undefined &&
    position === undefined &&
    duration === undefined &&
    videoUrl === undefined
  ) {
    return res.status(400).json({
      success: false,
      message: 'At least one field must be provided for update'
    });
  }

  // Validate title if provided
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Title must be a string with at least 3 characters'
      });
    }
  }

  // Validate description if provided
  if (description !== undefined) {
    if (typeof description !== 'string' || description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Description must be a string with at least 10 characters'
      });
    }
  }

  // Validate content if provided
  if (content !== undefined) {
    if (typeof content !== 'string' || content.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Content must be a string with at least 20 characters'
      });
    }
  }

  // Validate position if provided
  if (position !== undefined) {
    if (typeof position !== 'number' || position < 1 || !Number.isInteger(position)) {
      return res.status(400).json({
        success: false,
        message: 'Position must be a positive integer'
      });
    }
  }

  // Validate duration if provided
  if (duration !== undefined) {
    if (typeof duration !== 'number' || duration < 1) {
      return res.status(400).json({
        success: false,
        message: 'Duration must be a positive number (minutes)'
      });
    }
  }

  // Validate videoUrl if provided
  if (videoUrl !== undefined) {
    if (typeof videoUrl !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Video URL must be a string'
      });
    }
  }

  next();
};