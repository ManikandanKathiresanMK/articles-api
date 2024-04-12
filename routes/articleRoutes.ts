import express, { Request, Response, NextFunction } from "express";
const ArticleController = require("../controllers/articleController");

const router = express.Router();

router.get("/", ArticleController.listArticles);
router.get("/:id", ArticleController.getArticleContent);
router.post("/add", ArticleController.addArticles);

// Error handling middleware
router.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error("Invalid router path");
    res.status(404).json({ error: error.message });
  });
  
export default router;
