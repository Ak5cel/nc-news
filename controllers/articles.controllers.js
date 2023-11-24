const { selectArticleById, selectArticles, updateArticleById } = require("../models/articles.models");
const { checkTopicExists } = require("../models/topics.models");

exports.getArticles = (req, res, next) => {
  const { topic, sort_by } = req.query;

  const promises = [selectArticles({ topic, sort_by })];

  if (topic) {
    promises.push(checkTopicExists(topic));
  }

  Promise.all(promises)
    .then(([articles, _]) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticleById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
