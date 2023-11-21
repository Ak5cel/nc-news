const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { handleFourOhFour, getApi } = require("./controllers/api.controllers");
const { handleServerErrors, handleCustomErrors, handlePostgresErrors } = require("./errors");
const { getArticleById, getArticles } = require("./controllers/articles.controllers");
const { getCommentsByArticleId, postCommentUnderArticle } = require("./controllers/comments.controllers");

const app = express();
app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentUnderArticle);

app.all("*", handleFourOhFour);

app.use(handlePostgresErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
