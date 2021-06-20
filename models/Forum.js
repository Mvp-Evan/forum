const { ObjectId } = require("bson");

let forumsCollection;
let evaluatedForumsCollection;
require("../mongo").then(function (result) {
  forumsCollection = result.db().collection("forums");
  evaluatedForumsCollection = result.db().collection("evaluatedForums");
  commentsCollection = result.db().collection("comments");
  usersCollection = result.db().collection("users");
});

let Forum = function (data) {
  this.data = data;
};

Forum.prototype.addForum = function () {
  return new Promise(async (resolve, reject) => {
    this.data["up"] = 0;
    this.data["down"] = 0;
    this.data["authorId"] = this.data.userId;
    this.data["commentIds"] = [];
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
      .then(async function (targetForum) {
        if (targetForum) {
          this.data = targetForum;
          let comments = await Promise.all(
            this.data.commentIds.map(async function (commentId) {
              let comment = await commentsCollection.findOne({
                _id: ObjectId(commentId),
              });
              comment.commentId = comment._id;
              delete comment._id;
              let user = await usersCollection.findOne({
                _id: ObjectId(comment.userId),
              });
              comment.username = user.username;
              comment.profilePic = user.profilePic;
              delete comment.userId;
              return comment;
            })
          );
          resolve({
            forumTitle: this.data.title,
            forumBody: this.data.body,
            up: this.data.up,
            down: this.data.down,
            isVoted: isVoted,
            comments: comments,
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
            await forumsCollection.updateOne(
              { _id: ObjectId(this.data.forumId) },
              { $inc: { up: 1, down: -1 } }
            );
            await evaluatedForumsCollection.updateOne(
              { forumId: this.data.forumId, userId: this.data.userId },
              { $set: { isVoted: "up" } }
            );
            resolve("Downvote has been canceled and upvote successfully");
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
            await forumsCollection.updateOne(
              { _id: ObjectId(this.data.forumId) },
              { $inc: { up: -1, down: 1 } }
            );
            await evaluatedForumsCollection.updateOne(
              { forumId: this.data.forumId, userId: this.data.userId },
              { $set: { isVoted: "down" } }
            );
            resolve("Upvote has been canceled and downvote successfully");
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

Forum.prototype.addComment = function () {
  return new Promise(async (resolve, reject) => {
    let result = await commentsCollection.insertOne({
      userId: this.data.userId,
      commentBody: this.data.comment,
      replies: [],
    });
    await forumsCollection.updateOne(
      { _id: ObjectId(this.data.forumId) },
      {
        $push: {
          commentIds: result.insertedId,
        },
      }
    );
    resolve({ isPass: true });
  });
};

Forum.prototype.addReply = function () {
  return new Promise(async (resolve, reject) => {
    let user = await usersCollection.findOne({
      _id: ObjectId(this.data.userId),
    });
    await commentsCollection.updateOne(
      { _id: ObjectId(this.data.commentId) },
      {
        $push: {
          replies: {
            username: user.username,
            profilePic: user.profilePic,
            replyBody: this.data.reply,
          },
        },
      }
    );
    resolve({ isPass: true });
  });
};

module.exports = Forum;
