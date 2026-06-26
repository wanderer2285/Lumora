const express = require("express");
const enrollmentController = require("../controllers/enrollmentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/courses/:courseId/enroll",
  authMiddleware.verifyToken,
  authMiddleware.requireRole("STUDENT"),
  enrollmentController.enrollCourse
);

module.exports = router;