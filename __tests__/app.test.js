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

describe("/api/articles", () => {
  test("GET:200 sends an array of all articles to the client", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;

        expect(articles).toHaveLength(13);

        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("GET:200 response array is sorted by date in descending order by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;

        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET:200 comment_count of each article is calculated correctly", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;

        // check expected comment_count of top 3 articles from the response
        const [article_3, article_6, article_2] = articles;
        expect(article_3.comment_count).toBe(2);
        expect(article_6.comment_count).toBe(1);
        expect(article_2.comment_count).toBe(0);
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
  test("PATCH:200 updates the number of votes on the specified article and sends the updated article to the client", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: 7 })
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
          votes: 7,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH:200 decrements the number of votes on the specified article if inc_votes is negative", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: -7 })
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
          votes: -7,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH:400 responds with an error msg when given a badly-formed request (missing inc_votes)", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("PATCH:400 responds with an error msg when given a badly-formed request (inc_votes is not a number)", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: "notANumber" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("PATCH:400 responds with an error msg when given a badly-formed request (inc_votes is not an integer)", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: 7.7 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("PATCH:400 responds with an error msg when given an invalid article_id", () => {
    return request(app)
      .patch("/api/articles/banana")
      .send({ inc_votes: 7 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("PATCH:404 responds with an error msg when given a valid but non-existent article_id", () => {
    return request(app)
      .patch("/api/articles/777")
      .send({ inc_votes: 7 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
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
  test("GET:200 comments are sorted in descending order of created_at by default", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toHaveLength(11);
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET:200 responds with an empty array for an existing article_id that has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toHaveLength(0);
      });
  });
  test("GET:400 responds with an error msg when given an invalid article_id", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("GET:404 responds with an error msg when given a valid but non-existent article_id", () => {
    return request(app)
      .get("/api/articles/77/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("POST:201 posts a new comment at the article given and sends the new comment back to the client", () => {
    const newComment = {
      username: "icellusedkars",
      body: "listening to Epik High as it rains",
    };
    return request(app)
      .post("/api/articles/7/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment;

        expect(comment).toMatchObject({
          comment_id: 19,
          body: "listening to Epik High as it rains",
          article_id: 7,
          author: "icellusedkars",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test("POST:400 responds with an error msg when given a badly-formed comment (no username)", () => {
    const newComment = {
      body: "listening to Epik High as it rains",
    };
    return request(app)
      .post("/api/articles/7/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("POST:400 responds with an error msg when given a badly-formed comment (no body)", () => {
    const newComment = {
      username: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/7/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("POST:404 responds with an error msg when referencing a username that does not exist", () => {
    const newComment = {
      username: "notAUser",
      body: "listening to Epik High as it rains",
    };
    return request(app)
      .post("/api/articles/7/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Referenced Entity Not Found");
      });
  });
  test("POST:404 responds with an error msg when given a valid but non-existent article_id", () => {
    const newComment = {
      username: "icellusedkars",
      body: "listening to Epik High as it rains",
    };
    return request(app)
      .post("/api/articles/777/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("POST:400 responds with an error msg when given an invalid article_id", () => {
    const newComment = {
      username: "icellusedkars",
      body: "listening to Epik High as it rains",
    };
    return request(app)
      .post("/api/articles/banana/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
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
