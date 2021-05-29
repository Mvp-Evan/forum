var express = require("express");
var router = express.Router();
const forumController = require("../controllers/forumController");

router.post("/", forumController.home);
router.post("/addForum", forumController.addForum);
router.post("/detail", forumController.detail);

module.exports = router;
