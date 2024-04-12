import { Request, Response } from "express";
import pool from "../config/dbConfig";
import { Comment } from "../models/commentModel";

module.exports = {
  addComment: (req: Request, res: Response) => {
    const { articleId, comment, content, nickname }: Comment = req.body;

    // Check if the articleId is provided
    if (!articleId) {
      res.status(400).json({ error: "Article ID is required" });
      return;
    }
    if (!comment) {
      res.status(400).json({ error: "comment is required" });
      return;
    }

    // Query the article table to retrieve the nickname and content of the article
    const articleQuery = "SELECT nickname, content FROM article WHERE id = ?";
    pool.query(articleQuery, [articleId], (articleErr, articleRows: any[]) => {
      if (articleErr) {
        console.error("Error retrieving article data: " + articleErr.stack);
        res.status(500).json({ error: "Internal server error" });
        return;
      }

      // Check if the article exists
      if (articleRows.length === 0) {
        res.status(404).json({ error: "Article not found" });
        return;
      }

      const articleNickname = articleRows[0].nickname;
      const articleContent = articleRows[0].content;

      // Validate the provided nickname and content against the article's nickname and content
      if (nickname !== articleNickname || content !== articleContent) {
        res.status(400).json({ error: "Invalid nickname or content" });
        return;
      }

      // SQL query to insert data into the comment table
      const sql =
        "INSERT INTO comment (articleId, nickname, content, comment, creationDate) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)";
      const values = [articleId, nickname, content, comment];

      // Execute the query
      pool.query(sql, values, (err, result) => {
        if (err) {
          console.error(
            "Error inserting data into the comment table: " + err.stack
          );
          res.status(500).json({ error: "Internal server error" });
          return;
        }
        res.status(201).json({ message: "Comment added successfully" });
      });
    });
  },

  getAllComments: (req: Request, res: Response) => {
    const articleId = req.params.articleId;

    // Check if the articleId is not provided or is not a valid identifier
    if (!articleId || isNaN(parseInt(articleId))) {
      res.status(400).json({ error: "Invalid article ID" });
      return;
    }

    // SQL query to retrieve all comments for a specific article
    const sql =
      "SELECT id, comment, creationDate FROM comment WHERE articleId = ?";
    const values = [articleId];

    // Execute the query
    pool.query(sql, values, (err, rows: any[]) => {
      if (err) {
        console.error("Error retrieving comments: " + err.stack);
        res.status(500).json({ error: "Internal server error" });
        return;
      }

      // Check if the article ID exists in the table
      if (rows.length === 0) {
        res
          .status(404)
          .json({ error: "No comments found for the specified article ID" });
        return;
      }

      // Send the retrieved comments as the response
      res.status(200).json(rows);
    });
  },

  addReplies: (req: Request, res: Response) => {
    const { commentId, reply }: Comment = req.body;

    // Check if commentId and reply are provided
    if (!commentId || !reply) {
      return res
        .status(400)
        .json({ error: "Both commentId and reply are required." });
    }

    // Query to get the articleId based on the provided commentId
    const articleIdQuery = "SELECT articleId FROM comment WHERE id = ?";
    pool.query(articleIdQuery, [commentId], (err, rows) => {
      if (err) {
        console.error("Error retrieving articleId from comments: " + err.stack);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Check if the commentId exists
      if (rows.length === 0) {
        return res.status(404).json({ error: "Comment not found" });
      }

      const articleId = rows[0].articleId;

      // Inserting reply into the replies table
      const sql =
        "INSERT INTO replies (articleId, commentId, reply) VALUES (?, ?, ?)";
      const values = [articleId, commentId, reply];
      pool.query(sql, values, (err, result) => {
        if (err) {
          console.error(
            "Error inserting reply into the replies table: " + err.stack
          );
          return res.status(500).json({ error: "Internal server error" });
        }

        res.status(201).json({ message: "Reply added successfully" });
      });
    });
  },
};
