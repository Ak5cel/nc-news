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
  test("GET:200 accepts a topic query and responds with an array of articles with the given topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;

        expect(articles).toHaveLength(12);

        articles.forEach((article) => {
          expect(article).toHaveProperty("topic", "mitch");
        });
      });
  });
  test("GET:200 responds with an empty array when passed a query for an existing topic with no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
  test("GET:404 responds with an error msg when passed a query for a non-existent topic", () => {
    return request(app)
      .get("/api/articles?topic=banana")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("topic does not exist");
      });
  });
  test("GET:200 accepts a sort_by query and responds with an array of articles sorted by that column (in desc order by default)", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;

        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("votes", { descending: true, coerce: true });
      });
  });
  test("GET:200 accepts a request with sort_by=comment_count", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;

        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("comment_count", { descending: true, coerce: true });
      });
  });
  test("GET:400 responds with an error msg if sort_by is an existing column but not a field in the response (eg. `body`)", () => {
    return request(app)
      .get("/api/articles?sort_by=body")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("GET:400 responds with an error msg if the user enters an invalid sort_by field", () => {
    return request(app)
      .get("/api/articles?sort_by=banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("GET:200 accepts an order query and responds with an array of articles sorted in that order (sorted by `created_at` by default)", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;

        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("created_at");
      });
  });
  test("GET:200 accepts a combination of topic, sort_by and order queries", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=author&order=asc")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;

        expect(articles).toHaveLength(12);
        expect(articles).toBeSortedBy("author");
      });
  });
  test("GET:400 responds with an error msg when passed an invalid order query", () => {
    return request(app)
      .get("/api/articles?order=banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
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
  test("GET:200 sends the article with correctly calculated comment_count if it has comments", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;

        expect(article).toHaveProperty("comment_count", 11);
      });
  });
  test("GET:200 sends the article with comment_count set to 0 if it has no comments", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;

        expect(article).toHaveProperty("comment_count", 0);
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

describe("/api/comments/:comment_id", () => {
  test("DELETE:204 deletes the specified comment and sends no body back", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("DELETE:404 responds with an error msg when given a valid but non-existent comment_id", () => {
    return request(app)
      .delete("/api/comments/777")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment does not exist");
      });
  });
  test("DELETE:400 responds with an error msg when given an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("/api/users", () => {
  test("GET:200 sends an array of all users to the client", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;

        expect(users).toHaveLength(4);

        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("/api/users/:username", () => {
  test("GET:200 sends a single user to the client", () => {
    return request(app)
      .get("/api/users/icellusedkars")
      .expect(200)
      .then(({ body }) => {
        const user = body.user;

        expect(user).toMatchObject({
          username: "icellusedkars",
          name: "sam",
          avatar_url: "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
        });
      });
  });
  test("GET:404 responds with an error msg when passed a non-existent username", () => {
    return request(app)
      .get("/api/users/notAUser")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("user does not exist");
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
