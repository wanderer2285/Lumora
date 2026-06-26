const express = require("express");
const progressController = require("../controllers/progressController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.patch(
  "/lessons/:lessonId/progress",
  authMiddleware.verifyToken,
  authMiddleware.requireRole("STUDENT"),
  progressController.updateLessonProgress
);

module.exports = router;