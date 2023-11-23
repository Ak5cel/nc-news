const { checkArticleExists } = require("../models/articles.models");
const {
  selectCommentsByArticleId,
  insertComment: insertComment,
  removeCommentById,
} = require("../models/comments.models");

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

exports.postCommentUnderArticle = (req, res, next) => {
  const { article_id } = req.params;

  checkArticleExists(article_id)
    .then(() => {
      const newComment = { ...req.body, article_id };
      return insertComment(newComment);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send({});
    })
    .catch((err) => {
      next(err);
    });
};
