const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { handleFourOhFour, getApi } = require("./controllers/api.controllers");
const { handleServerErrors, handleCustomErrors, handlePostgresErrors } = require("./errors");
const { getArticleById, getArticles } = require("./controllers/articles.controllers");

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.all("*", handleFourOhFour);

app.use(handlePostgresErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
