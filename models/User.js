const bcrypt = require("bcryptjs");
const { ObjectId } = require("bson");
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
      this.data.address = "";
      this.data.tele = "";
      this.data.birthday = "";
      this.data.profilePic = "";
      await usersCollection.insertOne(this.data);
      resolve({ isPass: true, isValid: true });
    } else {
      if (this.errors.includes("Invalid email")) {
        reject({ isPass: false, isValid: false });
      } else {
        reject({ isPass: false, isValid: true });
      }
    }
  });
};

User.prototype.login = function () {
  return new Promise(async (resolve, reject) => {
    usersCollection
      .findOne({ email: this.data.email })
      .then((attemptedUser) => {
        if (
          attemptedUser &&
          bcrypt.compareSync(this.data.passwd, attemptedUser.passwd)
        ) {
          this.data = attemptedUser;
          resolve({
            isPass: true,
            username: this.data.username,
            userId: this.data._id,
          });
        } else {
          resolve({ isPass: false });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

User.prototype.getInfo = function () {
  return new Promise(async (resolve, reject) => {
    usersCollection
      .findOne({ _id: ObjectId(this.data.userId) })
      .then((targetUser) => {
        if (targetUser) {
          this.data = targetUser;
          resolve({
            profilePic: this.data.profilePic,
            username: this.data.username,
            email: this.data.email,
            address: this.data.address,
            tele: this.data.tele,
            birthday: this.data.birthday,
          });
        }
      });
  });
};

User.prototype.changeInfo = function () {
  return new Promise(async (resolve, reject) => {
    await this.validate();
    if (!this.errors.length) {
      let salt = bcrypt.genSaltSync(10);
      this.data.passwd = bcrypt.hashSync(this.data.passwd, salt);
      await usersCollection.updateOne(
        { _id: ObjectId(this.data.userId) },
        {
          $set: {
            profilePic: this.data.profilePic,
            username: this.data.username,
            email: this.data.email,
            address: this.data.address,
            tele: this.data.tele,
            birthday: this.data.birthday,
            passwd: this.data.passwd,
          },
        }
      );
      resolve({ isPass: true, isValid: true });
    } else {
      let salt = bcrypt.genSaltSync(10);
      this.data.passwd = bcrypt.hashSync(this.data.passwd, salt);
      await usersCollection.updateOne(
        { _id: ObjectId(this.data.userId) },
        {
          $set: {
            profilePic: this.data.profilePic,
            username: this.data.username,
            address: this.data.address,
            tele: this.data.tele,
            birthday: this.data.birthday,
            passwd: this.data.passwd,
          },
        }
      );
      if (this.errors.includes("Invalid email")) {
        reject({ isPass: false, isValid: false });
      } else {
        reject({ isPass: false, isValid: true });
      }
    }
  });
};

module.exports = User;
