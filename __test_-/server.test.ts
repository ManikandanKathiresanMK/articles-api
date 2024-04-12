// describe("Server.ts tests", () => {
//   test("Math test", () => {
//     expect(2 + 2).toBeLessThan(3)
//   });
// });

import supertest from "supertest";
import app from "../server";

describe("Article API", () => {
  it("should get all articles", async () => {
    // console.log("comming");
    const response = await supertest(app).get("api/v1/articles/get-articles");
    // console.log(response.statusCode);
    expect(response.statusCode).toBe(200);
  });

  // it("should get an article by ID", async () => {
  //   const articleId = 1;
  //   const response = await supertest(app).get(`/articles/${articleId}`);
  //   expect(response.status).toBe(200);
  // });

//   it("should create a new article", async () => {
//     const newArticle = {
//       nickname: "user",
//       title: "Article Testing",
//       content: "This is to create new Article.",
//     };

//     const response = await supertest(app)
//       .post("/articles/add")
//       .send(newArticle);

//     expect(response.status).toBe(200);
//   });
});