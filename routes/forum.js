var express = require("express");
var router = express.Router();
const forumController = require("../controllers/forumController");

router.post("/", forumController.home);
router.post("/addForum", forumController.addForum);
router.post("/detail", forumController.detail);
router.post("/detail/upvote", forumController.upvote);
router.post("/detail/downvote", forumController.downvote);
router.post("/detail/addComment", forumController.addComment);
router.post("/detail/addReply", forumController.addReply);

module.exports = router;
