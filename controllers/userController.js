const User = require("../models/User");

exports.signup = (req, res) => {
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

exports.login = (req, res) => {
  let user = new User(req.body);
  user
    .login()
    .then((result) => {
      res.json(result);
    })
    .catch((result) => {
      res.json(result);
    });
};

exports.edit = (req, res) => {
  let user = new User(req.body);
  user
    .edit()
    .then((result) => {
      res.send(result);
    })
    .catch((result) => {
      res.send(result);
    });
};
