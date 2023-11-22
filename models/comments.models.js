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
