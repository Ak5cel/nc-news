const db = require("../db/connection.js");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.checkTopicExists = (slug) => {
  return db.query("SELECT * FROM topics WHERE slug=$1", [slug]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "topic does not exist" });
    }
  });
};
