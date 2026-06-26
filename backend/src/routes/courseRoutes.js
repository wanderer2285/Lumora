const express = require('express');
const courseController = require('../controllers/courseController');
const courseValidation = require('../middleware/courseValidation');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * POST /courses
 * Create a new course (INSTRUCTOR, ADMIN)
 * Headers: Authorization: Bearer <token>
 * Body: { title, description, price, image, isPublished }
 */
router.post(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.requireRole('INSTRUCTOR', 'ADMIN'),
  courseValidation.validateCreateCourse,
  courseController.createCourse
);

/**
 * GET /courses
 * Get all courses with pagination and filters
 * Query: page=1&limit=10&published=true&instructorId=<id>
 */
router.get(
  '/',
  courseController.getAllCourses
);

/**
 * GET /courses/:courseId
 * Get course by ID with instructor, lessons, and enrollment count
 */
router.get(
  '/:courseId',
  courseController.getCourseById
);

/**
 * PATCH /courses/:courseId
 * Update course (INSTRUCTOR owner, ADMIN)
 * Headers: Authorization: Bearer <token>
 * Body: { title, description, price, image, isPublished }
 */
router.patch(
  '/:courseId',
  authMiddleware.verifyToken,
  authMiddleware.requireRole('INSTRUCTOR', 'ADMIN'),
  courseValidation.validateUpdateCourse,
  courseController.updateCourse
);

/**
 * DELETE /courses/:courseId
 * Delete course (INSTRUCTOR owner, ADMIN)
 * Headers: Authorization: Bearer <token>
 */
router.delete(
  '/:courseId',
  authMiddleware.verifyToken,
  authMiddleware.requireRole('INSTRUCTOR', 'ADMIN'),
  courseController.deleteCourse
);

module.exports = router;