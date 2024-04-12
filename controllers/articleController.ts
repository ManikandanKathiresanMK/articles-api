import { Request, Response } from "express";
import { Article } from "../models/articleModel";
import pool from "../config/dbConfig";

module.exports = {
  addArticles: (req: Request, res: Response) => {
    const { title, nickname, content }: Article = req.body;
    if (!title.trim() || !nickname.trim() || !content.trim()) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const sql =
      "INSERT INTO article (title, nickname, content, creationDate) VALUES (?, ?, ?, CURRENT_TIMESTAMP)";
    const values = [title, nickname, content];
    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error(
          "Error inserting data into the article table: " + err.stack
        );
        res.status(500).json({ error: "Internal server error" });
        return;
      }

      res.status(201).json({ message: "Article added successfully" });
    });
  },

  listArticles: (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const perPage = 20;
    const offset = (page - 1) * perPage;

    const sql = "SELECT * FROM article LIMIT ?, ?";
    const values = [offset, perPage];

    pool.query(sql, values, (err, rows: any[]) => {
      if (err) {
        console.error(
          "Error retrieving articles from the article table: " + err.stack
        );
        return res.status(500).json({ error: "Internal server error" });
      }

      if (!rows || !Array.isArray(rows)) {
        return res.status(404).json({ error: "No articles found" });
      }

      const articles = rows.map((row) => ({
        id: row.id,
        title: row.title,
        nickname: row.nickname,
        creationDate: row.creationDate,
      }));

      res.status(200).json(articles);
    });
  },

  getArticleContent: (req: Request, res: Response) => {
    const articleId = req.params.id; // Extract article ID from request parameters

    // SQL query to retrieve only the content of the article by ID
    const sql = "SELECT content FROM article WHERE id = ?";
    const values = [articleId];

    // Execute the query
    pool.query(sql, values, (err, rows: any[]) => {
      if (err) {
        console.error(
          "Error retrieving article content from the article table: " +
            err.stack
        );
        res.status(500).json({ error: "Internal server error" });
        return;
      }

      if (rows.length === 0) {
        res.status(404).json({ error: "Article not found" });
        return;
      }

      const articleContent: string = rows[0].content;

      res.status(200).json({ content: articleContent });
    });
  },
};
