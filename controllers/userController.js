const User = require("../models/User");

exports.home = (req, res) => {
  if (req.session.user) {
    res.send("User home page");
    res.send(req.session);
  } else {
    res.send("Default home page");
  }
};
exports.login = (req, res) => {
  let user = new User(req.body);
  user
    .login()
    .then(() => {
      req.session.user = { avatar: user.avatar, username: user.data.username };
      req.session.save(() => {
        res.redirect("/");
      });
    })
    .catch((e) => {
      req.flash("errors", e);
      req.session.save(() => {
        res.redirect("/");
      });
    });
};
