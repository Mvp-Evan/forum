const Forum = require("../models/Forum");

exports.home = (req, res) => {
  let forum = new Forum();
  forum
    .getAllForums()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};
exports.addForum = (req, res) => {
  let forum = new Forum(req.body);
  forum
    .addForum()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
};
exports.detail = (req, res) => {
  let forum = new Forum(req.body);
  forum
    .getDetail()
    .then((result) => {
      res.json(result);
    })
    .catch((result) => res.send(result));
};
exports.upvote = (req, res) => {
  let forum = new Forum(req.body);
  forum
    .upvote()
    .then((result) => {
      res.send(result);
    })
    .catch((result) => {
      res.send(result);
    });
};
exports.downvote = (req, res) => {
  let forum = new Forum(req.body);
  forum
    .downvote()
    .then((result) => {
      res.send(result);
    })
    .catch((result) => {
      res.send(result);
    });
};
exports.reply = (req, res) => {
  let forum = new Forum(req.body);
  forum
    .reply()
    .then((result) => {
      res.send(result);
    })
    .catch((result) => {
      res.send(result);
    });
};
