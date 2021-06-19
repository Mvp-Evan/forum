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

exports.changeInfo = (req, res) => {
  let user = new User(req.body);
  user
    .changeInfo()
    .then((result) => {
      res.send(result);
    })
    .catch((result) => {
      res.send(result);
    });
};

exports.getInfo = (req, res) => {
  let user = new User(req.body);
  user
    .getInfo()
    .then((result) => {
      res.json(result);
    })
    .catch((result) => {
      res.json(result);
    });
};
