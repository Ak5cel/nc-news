exports.handleFourOhFour = (req, res) => {
  res.status(404).send({ msg: "Path Not Found" });
};
