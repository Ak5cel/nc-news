const express = require("express");
const { handleFourOhFour } = require("./controllers/api.controllers");
const { handleServerErrors, handleCustomErrors, handlePostgresErrors } = require("./errors");

const apiRouter = require("./routes/api-router");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.all("*", handleFourOhFour);

app.use(handlePostgresErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
