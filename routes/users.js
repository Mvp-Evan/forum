var express = require("express");
var router = express.Router();
const userController = require("../controllers/userController");

/* GET users listing. */
router.get("/", userController.home);
router.post("/register", function (req, res) {
  res.send("thank you for register");
});
router.post("/login", function (req, res) {
  res.send("You have logged in.");
});
router.post("/logout", function (req, res) {
  res.send("You have logged out");
});

module.exports = router;
