let forumsCollection;
require("../mongo").then(function (result) {
  forumsCollection = result.db().collection("forums");
});

let Forum = function (data) {
  data["up"] = 0;
  data["down"] = 0;
  this.data = data;
};

Forum.prototype.addForum = function () {
  return new Promise(async (resolve, reject) => {
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

module.exports = Forum;
