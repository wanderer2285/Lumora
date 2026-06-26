const prisma = require('../config/prisma');

/**
 * Create a new course
 * POST /courses
 * Headers: Authorization: Bearer <token>
 * Body: { title, description, price, image, isPublished }
 */
exports.createCourse = async (req, res) => {
  try {
    const { title, description, thumbnailUrl, isPublished } = req.body;
    const instructorId = req.user.userId;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    if (title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Title must be at least 3 characters'
      });
    }

    if (description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Description must be at least 10 characters'
      });
    }

    // Create course
    const course = await prisma.course.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        instructorId,
        thumbnailUrl: thumbnailUrl || null,
        isPublished: isPublished || false
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });

  } catch (error) {
    console.error('Create course error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create course'
    });
  }
};

/**
 * Get all courses
 * GET /courses
 * Query params: page=1&limit=10&published=true&instructorId=<id>
 */
exports.getAllCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10, published, instructorId } = req.query;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const where = {};

    if (published === 'true') {
      where.isPublished = true;
    } else if (published === 'false') {
      where.isPublished = false;
    }

    if (instructorId) {
      where.instructorId = instructorId;
    }

    // Get total count
    const total = await prisma.course.count({ where });

    // Get courses with instructor details
    const courses = await prisma.course.findMany({
      where,
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      skip,
      take: limitNum,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json({
      success: true,
      data: courses,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    console.error('Get all courses error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch courses'
    });
  }
};

/**
 * Get course by ID
 * GET /courses/:courseId
 */
exports.getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        lessons: {
          select: {
            id: true,
            title: true,
            position: true,
            duration: true
          },
          orderBy: {
            position: 'asc'
          }
        },
        enrollments: {
          select: {
            id: true
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Add enrollment count
    const courseWithEnrollmentCount = {
      ...course,
      enrollmentCount: course.enrollments.length,
      enrollments: undefined
    };

    return res.status(200).json({
      success: true,
      data: courseWithEnrollmentCount
    });

  } catch (error) {
    console.error('Get course by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch course'
    });
  }
};

/**
 * Update course
 * PATCH /courses/:courseId
 * Headers: Authorization: Bearer <token>
 * Body: { title, description, price, image, isPublished }
 */
exports.updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, price, image, isPublished } = req.body;
    const userId = req.user.userId;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    // Check if course exists and user is instructor
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (req.user.role !== 'ADMIN' && course.instructorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this course'
      });
    }

    // Build update data
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (price !== undefined) updateData.price = price;
    if (image !== undefined) updateData.image = image;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    // Update course
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: updateData
    });

    return res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse
    });

  } catch (error) {
    console.error('Update course error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update course'
    });
  }
};

/**
 * Delete course
 * DELETE /courses/:courseId
 * Headers: Authorization: Bearer <token>
 */
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    // Check if course exists and user is instructor
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this course'
      });
    }

    // Delete course (cascades to lessons, enrollments, progress)
    await prisma.course.delete({
      where: { id: courseId }
    });

    return res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });

  } catch (error) {
    console.error('Delete course error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete course'
    });
  }
};