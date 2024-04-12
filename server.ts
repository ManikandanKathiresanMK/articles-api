require("dotenv").config();

import express from "express";
import pool from "./config/dbConfig";

// import routes 
import articleRoutes from "./routes/articleRoutes";
import commentRoutes from "./routes/commentRoutes";

// create express app
const app = express();

// middlewares
app.use(express.json());

pool.getConnection((err, res) => {
  if (err) {
    console.log("Db connecting fails", err);
  } else {
    console.log("DataBase connected success.");
  }
});

app.use("/articles", articleRoutes);
app.use("/comments", commentRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "This is home page",
  });
});

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on Port ${process.env.APP_PORT}`);
});
export default app;
