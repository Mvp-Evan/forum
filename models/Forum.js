const { ObjectId } = require("bson");

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
    delete this.data.userId;
    await forumsCollection.insertOne(this.data);
    resolve(true);
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
          allFroumIdsAndTitles.push({ _id: forum._id, title: forum.title });
        });
        resolve(allFroumIdsAndTitles);
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

module.exports = Forum;
