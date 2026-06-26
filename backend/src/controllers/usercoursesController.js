const prisma = require("../config/prisma"); 

/**
 * Get all enrolled courses for authenticated user
 * GET /api/users/me/courses
 * Headers: Authorization: Bearer <token>
 * 
 * Returns all courses the user is enrolled in with:
 * - course title, description, image (thumbnailUrl)
 * - enrollment status and progress
 */
exports.getMyCourses = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get all enrollments for user with course details
    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: userId,
        course: {
        isPublished: true
        }
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnailUrl: true,
            isPublished: true,
            instructor: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: {
        enrolledAt: 'desc'
      }
    });

    // Transform response to include required fields
    const courses = enrollments.map((enrollment) => ({
      enrollmentId: enrollment.id,
      courseId: enrollment.course.id,
      title: enrollment.course.title,
      description: enrollment.course.description,
      thumbnailUrl: enrollment.course.thumbnailUrl,
      instructor: enrollment.course.instructor,
      status: enrollment.status,
      progress: enrollment.progress,
      enrolledAt: enrollment.enrolledAt,
      completedAt: enrollment.completedAt
    }));

    return res.status(200).json({
  success: true,
  data: enrollments.map((enrollment) => ({
    enrollmentId: enrollment.id,
    status: enrollment.status,
    progress: enrollment.progress,
    enrolledAt: enrollment.enrolledAt,
    completedAt: enrollment.completedAt,

    course: {
      id: enrollment.course.id,
      title: enrollment.course.title,
      description: enrollment.course.description,
      thumbnailUrl: enrollment.course.thumbnailUrl,
      instructor: enrollment.course.instructor
    }
  }))
});

  } catch (error) {
    console.error('Get my courses error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch enrolled courses'
    });
  }
};