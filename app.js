const express = require("express");
const cors = require("cors");
const { handleFourOhFour } = require("./controllers/api.controllers");
const { handleServerErrors, handleCustomErrors, handlePostgresErrors } = require("./errors");

const apiRouter = require("./routes/api-router");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.all("*", handleFourOhFour);

app.use(handlePostgresErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
