const prisma = require("../config/prisma"); 

/**
 * Update lesson progress for authenticated student
 * PATCH /api/lessons/:lessonId/progress
 * Headers: Authorization: Bearer <token>
 * Body: { status, timeSpent, completedAt, lastPosition }
 * 
 * Creates progress record if doesn't exist
 * If status is COMPLETED, updates enrollment progress percentage
 */
exports.updateLessonProgress = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const studentId = req.user.userId;
    const { status, timeSpent, completedAt, lastPosition } = req.body;

    // Validate lessonId
    if (!lessonId) {
      return res.status(400).json({
        success: false,
        message: 'Lesson ID is required'
      });
    }

    // Validate status if provided
    const validStatuses = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: NOT_STARTED, IN_PROGRESS, COMPLETED'
      });
    }

    // Validate timeSpent if provided
    if (timeSpent !== undefined && (typeof timeSpent !== 'number' || timeSpent < 0)) {
      return res.status(400).json({
        success: false,
        message: 'timeSpent must be a non-negative number'
      });
    }

    if (lastPosition !== undefined && (typeof lastPosition !== "number" || lastPosition < 0)){
      return res.status(400).json({
        success: false,
        message: 'lastPosition must be a non-negative number'
      });
    }

    // Get lesson with course and enrollment info
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          select: {
            id: true
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

    // Get enrollment for student in this course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId: lesson.course.id
        }
      }
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }

    // Build update data
    const updateData = {};
    if (status) updateData.status = status;
    if (timeSpent !== undefined) updateData.timeSpent = timeSpent;
    if (completedAt !== undefined) updateData.completedAt = new Date(completedAt);
    if(lastPosition !== undefined) updateData.lastPosition = lastPosition;

    // Find or create progress record
    let progress = await prisma.progress.upsert({
    where:{
        studentId_lessonId:{
            studentId,
            lessonId
        }
    },
    update:updateData,
    create:{
        studentId,
        lessonId,
        enrollmentId: enrollment.id,
        ...updateData
    }
})

    // if (progress) {
    //   // Update existing progress record
    //   progress = await prisma.progress.update({
    //     where: { id: progress.id },
    //     data: updateData
    //   });
    // } else {
    //   // Create new progress record
    //   progress = await prisma.progress.create({
    //     data: {
    //       studentId,
    //       lessonId,
    //       enrollmentId: enrollment.id,
    //       ...updateData
    //     }
    //   });
    // }

   // Recalculate enrollment progress after every progress update

// Count total lessons in course
const totalLessons = await prisma.lesson.count({
  where: { courseId: lesson.course.id }
});

// Count completed lessons for this student
const completedLessons = await prisma.progress.count({
  where: {
    studentId,
    status: "COMPLETED",
    lesson: {
      courseId: lesson.course.id
    }
  }
});

// Calculate progress percentage
const progressPercentage =
  totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

// Build enrollment update
const enrollmentUpdate = {
  progress: progressPercentage
};

if (progressPercentage === 100) {
  enrollmentUpdate.status = "COMPLETED";
  enrollmentUpdate.completedAt = new Date();
} else {
  enrollmentUpdate.status = "ACTIVE";
  enrollmentUpdate.completedAt = null;
}

// Update enrollment
await prisma.enrollment.update({
  where: { id: enrollment.id },
  data: enrollmentUpdate
});

    return res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: progress
    });

  } catch (error) {
    console.error('Update lesson progress error:', error);

    // Handle Prisma foreign key constraint error
    if (error.code === 'P2003') {
      return res.status(400).json({
        success: false,
        message: 'Invalid lesson or enrollment'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update progress'
    });
  }
};