const User = require("../models/User");

exports.signup = (req, res) => {
  console.log(req.body);
  let user = new User(req.body);
  user
    .signup()
    .then((result) => {
      res.json(result);
    })
    .catch((result) => {
      res.json(result);
    });
};

exports.login = (req, res) => {};
