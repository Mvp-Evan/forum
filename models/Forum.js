const { ObjectId } = require("bson");
const { format } = require("morgan");

let forumsCollection;
let evaluatedForumsCollection;
require("../mongo").then(function (result) {
  forumsCollection = result.db().collection("forums");
  evaluatedForumsCollection = result.db().collection("evaluatedForums");
});

let Forum = function (data) {
  this.data = data;
};

Forum.prototype.addForum = function () {
  return new Promise(async (resolve, reject) => {
    this.data["up"] = 0;
    this.data["down"] = 0;
    this.data["authorId"] = this.data.userId;
    this.data["comments"] = [];
    delete this.data.userId;
    await forumsCollection.insertOne(this.data);
    resolve("Add Forum Successfully");
  });
};

Forum.prototype.getAllForums = function () {
  return new Promise(async (resolve, reject) => {
    allFroumIdsAndTitles = [];
    allForums = forumsCollection
      .find()
      .toArray()
      .then((forumsArray) => {
        forumsArray.forEach((forum) => {
          allFroumIdsAndTitles.push([forum._id, forum.title]);
        });
        resolve({ forum: allFroumIdsAndTitles });
      })
      .catch((err) => console.log(err));
  });
};

Forum.prototype.getDetail = function () {
  return new Promise(async (resolve, reject) => {
    let isVoted = "no";
    evaluatedForumsCollection
      .findOne({ userId: this.data.userId, forumId: this.data.forumId })
      .then((result) => {
        if (result) {
          isVoted = result.isVoted;
        }
      })
      .catch((err) => console.log(err));
    forumsCollection
      .findOne({ _id: ObjectId(this.data.forumId) })
      .then((targetForum) => {
        if (targetForum) {
          this.data = targetForum;
          resolve({
            forumTitle: this.data.title,
            forumBody: this.data.body,
            up: this.data.up,
            down: this.data.down,
            isVoted: isVoted,
          });
        } else {
          reject("Forum not Found");
        }
      })
      .catch((err) => console.log(err));
  });
};

Forum.prototype.upvote = function () {
  return new Promise(async (resolve, reject) => {
    evaluatedForumsCollection
      .findOne({
        userId: this.data.userId,
        forumId: this.data.forumId,
      })
      .then(async (target) => {
        if (target) {
          if (target.isVoted == "up") {
            await forumsCollection.updateOne(
              { _id: ObjectId(this.data.forumId) },
              { $inc: { up: -1 } }
            );
            await evaluatedForumsCollection.deleteOne({
              userId: this.data.userId,
              forumId: this.data.forumId,
            });
            resolve("Upvote has been canceled");
          } else {
            reject("You have downvoted it");
          }
        } else {
          await forumsCollection.updateOne(
            { _id: ObjectId(this.data.forumId) },
            { $inc: { up: 1 } }
          );
          await evaluatedForumsCollection.insertOne({
            userId: this.data.userId,
            forumId: this.data.forumId,
            isVoted: "up",
          });
          resolve("Upvote successfully");
        }
      });
  });
};

Forum.prototype.downvote = function () {
  return new Promise(async (resolve, reject) => {
    evaluatedForumsCollection
      .findOne({
        userId: this.data.userId,
        forumId: this.data.forumId,
      })
      .then(async (target) => {
        if (target) {
          if (target.isVoted == "down") {
            await forumsCollection.updateOne(
              { _id: ObjectId(this.data.forumId) },
              { $inc: { down: -1 } }
            );
            await evaluatedForumsCollection.deleteOne({
              userId: this.data.userId,
              forumId: this.data.forumId,
            });
            resolve("Downvote has been canceled");
          } else {
            reject("You have upvoted it");
          }
        } else {
          await forumsCollection.updateOne(
            { _id: ObjectId(this.data.forumId) },
            { $inc: { down: 1 } }
          );
          await evaluatedForumsCollection.insertOne({
            userId: this.data.userId,
            forumId: this.data.forumId,
            isVoted: "down",
          });
          resolve("Downvote successfully");
        }
      });
  });
};

Forum.prototype.reply = function () {
  return new Promise(async (resolve, reject) => {
    await forumsCollection.updateOne(
      { forumId: this.data.forumId },
      {
        $push: {
          comments: {
            username: this.data.username,
            comment: this.data.comment,
          },
        },
      }
    );
    resolve("Add Comment Successfully");
  });
};

module.exports = Forum;
