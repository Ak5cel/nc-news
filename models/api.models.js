const fs = require("fs/promises");

exports.selectEndpointsData = () => {
  const path = `${__dirname}/../endpoints.json`;

  return fs.readFile(path).then((fileContents) => {
    const endpointsData = JSON.parse(fileContents);

    return endpointsData;
  });
};
