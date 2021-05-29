let usersCollection;
require("./mongo").then(function (result) {
  usersCollection = result.db().collection("users");
  usersCollection
    .findOne({ email: "123@13.com" })
    .then(() => {
      console.log("success");
    })
    .catch(() => {
      console.log("fail");
    });
});
