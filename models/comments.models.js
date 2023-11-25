const db = require("../db/connection.js");

exports.selectCommentsByArticleId = (article_id) => {
  const queryString = `
  SELECT *
  FROM comments
  WHERE article_id=$1
  ORDER BY created_at DESC;
  `;

  return db.query(queryString, [article_id]).then(({ rows }) => {
    return rows;
  });
};

exports.insertComment = (newComment) => {
  const queryString = `
  INSERT INTO comments
    (body, article_id, author)
  VALUES
    ($1, $2, $3)
  RETURNING *;
  `;

  return db.query(queryString, [newComment.body, newComment.article_id, newComment.username]).then(({ rows }) => {
    return rows[0];
  });
};

exports.removeCommentById = (comment_id) => {
  const queryString = `
  DELETE FROM comments
  WHERE comment_id=$1
  RETURNING *;
  `;

  return db.query(queryString, [comment_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "comment does not exist" });
    }
  });
};

exports.updateCommentById = (comment_id, inc_votes) => {
  const queryString = `
  UPDATE comments
  SET votes = votes + $1
  WHERE comment_id=$2
  RETURNING *;
  `;

  return db.query(queryString, [inc_votes, comment_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "comment does not exist" });
    }

    return rows[0];
  });
};
