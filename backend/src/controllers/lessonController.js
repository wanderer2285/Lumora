const prisma = require("../config/prisma");
/**
 * Create a new lesson
 * POST /api/courses/:courseId/lessons
 * Headers: Authorization: Bearer <token>
 * Body: { title, description, content, position, duration, videoUrl }
 * 
 * Requirements:
 * - Course must exist
 * - User must be course instructor or ADMIN
 * - All required fields must be provided
 */
exports.createLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, content, position, duration, videoUrl } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // // Validation: Required fields
    // if (!title || !description || !content || position === undefined) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Title, description, content, and position are required'
    //   });
    // }

    // // Validation: Field lengths and types
    // if (typeof title !== 'string' || title.trim().length < 3) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Title must be a string with at least 3 characters'
    //   });
    // }

    // if (typeof description !== 'string' || description.trim().length < 10) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Description must be a string with at least 10 characters'
    //   });
    // }

    // if (typeof content !== 'string' || content.trim().length < 20) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Content must be a string with at least 20 characters'
    //   });
    // }

    // if (typeof position !== 'number' || position < 1) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Position must be a positive number'
    //   });
    // }

    // if (duration !== undefined && (typeof duration !== 'number' || duration < 1)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Duration must be a positive number (minutes)'
    //   });
    // }

    // if (videoUrl !== undefined && typeof videoUrl !== 'string') {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Video URL must be a string'
    //   });
    // }

    // Validate course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        instructorId: true,
        title: true
      }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check authorization: User must be course instructor or ADMIN
    if (course.instructorId !== userId && userRole !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to add lessons to this course'
      });
    }

    // Check if position already exists for this course
    const existingLesson = await prisma.lesson.findUnique({
      where: {
        courseId_position: {
          courseId,
          position: position
        }
      }
    });

    if (existingLesson) {
      return res.status(409).json({
        success: false,
        message: `A lesson at position ${position} already exists for this course`
      });
    }

    // Create lesson
    const lesson = await prisma.lesson.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        courseId,
        position: position,
        duration: duration ?? null,
        videoUrl: videoUrl ?? null
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: lesson
    });

  } catch (error) {
    console.error('Create lesson error:', error);

    // Handle Prisma foreign key constraint error
    if (error.code === 'P2003') {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create lesson'
    });
  }
};

/**
 * Get lessons for a course
 * GET /api/courses/:courseId/lessons
 */
exports.getCourseLessons = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { orderBy = 'asc' } = req.query;

    // Validate course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Get lessons ordered by position
    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: {
        position: orderBy === 'desc' ? 'desc' : 'asc'
      }
    });

    return res.status(200).json({
      success: true,
      data: lessons
    });

  } catch (error) {
    console.error('Get course lessons error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch lessons'
    });
  }
};

/**
 * Get lesson by ID
 * GET /api/courses/:courseId/lessons/:lessonId
 */
exports.getLessonById = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    // Validate course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Get lesson
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Verify lesson belongs to course
    if (lesson.courseId !== courseId) {
      return res.status(400).json({
        success: false,
        message: 'Lesson does not belong to this course'
      });
    }

    return res.status(200).json({
      success: true,
      data: lesson
    });

  } catch (error) {
    console.error('Get lesson by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch lesson'
    });
  }
};

/**
 * Update lesson
 * PATCH /api/courses/:courseId/lessons/:lessonId
 * Headers: Authorization: Bearer <token>
 * Body: { title, description, content, position, duration, videoUrl }
 */
exports.updateLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const { title, description, content, position, duration, videoUrl } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Validate course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        instructorId: true
      }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check authorization
    if (course.instructorId !== userId && userRole !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update lessons in this course'
      });
    }

    // Validate lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId }
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Verify lesson belongs to course
    if (lesson.courseId !== courseId) {
      return res.status(400).json({
        success: false,
        message: 'Lesson does not belong to this course'
      });
    }

    // Build update data
    const updateData = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length < 3) {
        return res.status(400).json({
          success: false,
          message: 'Title must be a string with at least 3 characters'
        });
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== 'string' || description.trim().length < 10) {
        return res.status(400).json({
          success: false,
          message: 'Description must be a string with at least 10 characters'
        });
      }
      updateData.description = description.trim();
    }

    if (content !== undefined) {
      if (typeof content !== 'string' || content.trim().length < 20) {
        return res.status(400).json({
          success: false,
          message: 'Content must be a string with at least 20 characters'
        });
      }
      updateData.content = content.trim();
    }

    if (position !== undefined) {
      if (typeof position !== 'number' || position < 1) {
        return res.status(400).json({
          success: false,
          message: 'Position must be a positive number'
        });
      }

      // Check if new position already exists (and it's different from current)
      if (position !== lesson.position) {
        const existingLesson = await prisma.lesson.findUnique({
          where: {
            courseId_position: {
              courseId,
              position: position
            }
          }
        });

        if (existingLesson) {
          return res.status(409).json({
            success: false,
            message: `A lesson at position ${position} already exists for this course`
          });
        }
      }

      updateData.position = position;
    }

    if (duration !== undefined) {
      if (typeof duration !== 'number' || duration < 1) {
        return res.status(400).json({
          success: false,
          message: 'Duration must be a positive number'
        });
      }
      updateData.duration = duration;
    }

    if (videoUrl !== undefined) {
      if (typeof videoUrl !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Video URL must be a string'
        });
      }
      updateData.videoUrl = videoUrl || null;
    }

    // Update lesson
    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: updateData
    });

    return res.status(200).json({
      success: true,
      message: 'Lesson updated successfully',
      data: updatedLesson
    });

  } catch (error) {
    console.error('Update lesson error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update lesson'
    });
  }
};

/**
 * Delete lesson
 * DELETE /api/courses/:courseId/lessons/:lessonId
 * Headers: Authorization: Bearer <token>
 */
exports.deleteLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Validate course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        instructorId: true
      }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check authorization
    if (course.instructorId !== userId && userRole !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete lessons in this course'
      });
    }

    // Validate lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId }
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Verify lesson belongs to course
    if (lesson.courseId !== courseId) {
      return res.status(400).json({
        success: false,
        message: 'Lesson does not belong to this course'
      });
    }

    // Delete lesson
    await prisma.lesson.delete({
      where: { id: lessonId }
    });

    return res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully'
    });

  } catch (error) {
    console.error('Delete lesson error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete lesson'
    });
  }
};