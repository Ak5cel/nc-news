const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");
const fs = require("fs/promises");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
  test("GET:200 responds with an object describing all endpoints available", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const readPromise = fs.readFile(`${__dirname}/../endpoints.json`);

        return Promise.all([readPromise, body]);
      })
      .then(([fileContents, body]) => {
        const endpointsData = JSON.parse(fileContents);

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
