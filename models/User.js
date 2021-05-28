const bcrypt = require("bcryptjs");
let usersCollection;
require("../mongo").then(function (result) {
  usersCollection = result.db().collection("users");
});
const validator = require("validator");

let User = function (data) {
  this.data = data;
  this.errors = [];
};

User.prototype.validate = function () {
  return new Promise(async (resolve, reject) => {
    if (!validator.isEmail(this.data.email)) {
      this.errors.push("Invalid email");
    } else {
      let emailExists = await usersCollection.findOne({
        email: this.data.email,
      });
      if (emailExists) {
        this.errors.push("Email exists");
      }
    }
    resolve();
  });
};

User.prototype.signup = function () {
  return new Promise(async (resolve, reject) => {
    await this.validate();
    if (!this.errors.length) {
      let salt = bcrypt.genSaltSync(10);
      this.data.passwd = bcrypt.hashSync(this.data.passwd, salt);
      await usersCollection.insertOne(this.data);
      resolve({ isPass: true, isValid: true });
    } else {
      console.log(this.data);
      if (this.errors.includes("Invalid email")) {
        reject({ isPass: false, isValid: false });
      } else {
        reject({ isPass: false, isValid: true });
      }
    }
  });
};

module.exports = User;
