const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");
const endpointsData = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
  test("GET:200 responds with an object describing all endpoints available", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject(endpointsData);
      });
  });
});

describe("/api/topics", () => {
  test("GET:200 sends an array of topics to the client", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;

        expect(topics).toHaveLength(3);

        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET:200 sends a single article to the client", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toMatchObject({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          created_at: new Date(1604394720000).toJSON(),
          body: "some gifs",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("GET:404 responds with an appropriate status and error msg when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/77")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("GET:400 responds with an appropriate status and error msg when given an invalid id", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET:200 sends an array of comments belonging to the given article_id to the client", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;

        expect(comments).toHaveLength(11);

        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          });
        });
      });
  });
  test.todo("GET:200 comments are sorted in descending order of created_at by default");
  test.todo("GET:200 responds with an empty array for an existing article_id that has no comments");
  test.todo("GET:400 responds with an error msg when given an invalid article_id");
  test.todo("GET:404 responds with an error msg when given a valid but non-existent article_id");
});

describe("ANY /invalidPath", () => {
  test("404: responds with an error message if path is not found", () => {
    return request(app)
      .get("/invalidPath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path Not Found");
      });
  });
});
