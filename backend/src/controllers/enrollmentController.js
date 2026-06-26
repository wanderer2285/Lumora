const prisma = require("../config/prisma");

/**
 * Enroll student in a course
 * POST /api/courses/:courseId/enroll
 * Headers: Authorization: Bearer <token>
 * 
 * Requirements:
 * - Only authenticated STUDENT can enroll
 * - Course must exist
 * - Student cannot be already enrolled
 * - Creates enrollment with status ACTIVE and progress 0
 */
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.userId;

    // Validate courseId
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true
      }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if student is already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId
        }
      }
    });

    if (existingEnrollment) {
      return res.status(409).json({
        success: false,
        message: 'You are already enrolled in this course'
      });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId,
        courseId,
        status: 'ACTIVE',
        progress: 0
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true
          }
        },
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: enrollment
    });

  } catch (error) {
    console.error('Enroll course error:', error);

    // Handle Prisma foreign key constraint error
    if (error.code === 'P2003') {
      return res.status(400).json({
        success: false,
        message: 'Invalid course or student ID'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to enroll in course'
    });
  }
};