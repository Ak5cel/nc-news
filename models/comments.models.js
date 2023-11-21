const db = require("../db/connection.js");

exports.selectCommentsByArticleId = (article_id) => {
  const queryString = `
  SELECT * FROM comments WHERE article_id=$1;
  `;
  return db.query(queryString, [article_id]).then(({ rows }) => {
    return rows;
  });
};
