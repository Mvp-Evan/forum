var express = require("express");
var router = express.Router();
const userController = require("../controllers/userController.js");

/* GET users listing. */
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/info", userController.getInfo);
router.post("/changeInfo", userController.changeInfo);

module.exports = router;
