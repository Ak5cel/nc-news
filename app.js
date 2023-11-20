const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { handleFourOhFour } = require("./controllers/api.controllers");
const { handleServerErrors } = require("./errors");

const app = express();

app.get("/api/topics", getTopics);

app.all("*", handleFourOhFour);

app.use(handleServerErrors);

module.exports = app;
