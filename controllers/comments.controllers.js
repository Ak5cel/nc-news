const { checkArticleExists } = require("../models/articles.models");
const { selectCommentsByArticleId } = require("../models/comments.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  const promises = [selectCommentsByArticleId(article_id), checkArticleExists(article_id)];

  Promise.all(promises)
    .then(([comments, _]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
