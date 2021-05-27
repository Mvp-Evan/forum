let mongo;
require("./mongo").then(function (result) {
  mongo = result;
  console.log(mongo);
});
