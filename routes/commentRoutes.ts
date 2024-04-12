import express, { Request, Response, NextFunction } from "express";
const CommentController = require("../controllers/commentController");

const router = express.Router();
router.post("/add", CommentController.addComment);
router.get("/:articleId", CommentController.getAllComments);
router.post("/reply", CommentController.addReplies);

// Error handling middleware
router.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Invalid router path");
  res.status(404).json({ error: error.message });
});

export default router;
