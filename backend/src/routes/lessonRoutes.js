const express = require('express');
const lessonController = require('../controllers/lessonController');
const lessonValidation = require('../middleware/lessonValidation');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

/**
 * POST /api/courses/:courseId/lessons
 * Create a new lesson (INSTRUCTOR owner or ADMIN)
 * Headers: Authorization: Bearer <token>
 * Body: { title, description, content, position, duration, videoUrl }
 */
router.post(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.requireRole('INSTRUCTOR', 'ADMIN'),
  lessonValidation.validateCreateLesson,
  lessonController.createLesson
);

/**
 * GET /api/courses/:courseId/lessons
 * Get all lessons for a course
 * Query: orderBy=asc|desc (default: asc)
 */
router.get(
  '/',
  lessonController.getCourseLessons
);

/**
 * GET /api/courses/:courseId/lessons/:lessonId
 * Get a specific lesson
 */
router.get(
  '/:lessonId',
  lessonController.getLessonById
);

/**
 * PATCH /api/courses/:courseId/lessons/:lessonId
 * Update a lesson (INSTRUCTOR owner or ADMIN)
 * Headers: Authorization: Bearer <token>
 * Body: { title, description, content, position, duration, videoUrl }
 */
// router.patch(
//   '/:lessonId',
//   authMiddleware.verifyToken,
//   authMiddleware.requireRole('INSTRUCTOR', 'ADMIN'),
//   lessonValidation.validateUpdateLesson,
//   lessonController.updateLesson
// );

/**
 * DELETE /api/courses/:courseId/lessons/:lessonId
 * Delete a lesson (INSTRUCTOR owner or ADMIN)
 * Headers: Authorization: Bearer <token>
 */
// router.delete(
//   '/:lessonId',
//   authMiddleware.verifyToken,
//   authMiddleware.requireRole('INSTRUCTOR', 'ADMIN'),
//   lessonController.deleteLesson
// );

module.exports = router;