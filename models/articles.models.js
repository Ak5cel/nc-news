const db = require("../db/connection.js");

exports.selectArticles = ({ topic }) => {
  let queryString = `
  SELECT 
    articles.article_id, 
    articles.author, 
    articles.title, 
    articles.topic, 
    articles.created_at, 
    articles.votes, 
    articles.article_img_url, 
    COUNT(comments.comment_id)::INT as comment_count
  FROM articles LEFT JOIN comments
    ON articles.article_id = comments.article_id
  GROUP BY articles.article_id 
  `;

  const queryValues = [];

  if (topic) {
    queryString += "HAVING articles.topic = $1 ";
    queryValues.push(topic);
  }

  queryString += `ORDER BY articles.created_at DESC `;

  return db.query(queryString, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db.query("SELECT * FROM articles WHERE article_id=$1;", [article_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "article does not exist" });
    }
    return rows[0];
  });
};

exports.updateArticleById = (article_id, inc_votes) => {
  const queryString = `
  UPDATE articles
  SET votes = votes + $1
  WHERE article_id=$2
  RETURNING *;
  `;

  return db.query(queryString, [inc_votes, article_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "article does not exist" });
    }
    return rows[0];
  });
};

exports.checkArticleExists = (article_id) => {
  return db.query("SELECT * FROM articles WHERE article_id=$1;", [article_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "article does not exist" });
    }
  });
};
