const { selectEndpointsData } = require("../models/api.models");

exports.getApi = (req, res, next) => {
  selectEndpointsData()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      next(err);
    });
};

exports.handleFourOhFour = (req, res) => {
  res.status(404).send({ msg: "Path Not Found" });
};
