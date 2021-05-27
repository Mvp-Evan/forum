const MongoClient = require("mongodb").MongoClient;

async function main() {
  const dbURI =
    "mongodb://forumUser:forumUserPassword@cluster0-shard-00-00.6yyv9.mongodb.net:27017,cluster0-shard-00-01.6yyv9.mongodb.net:27017,cluster0-shard-00-02.6yyv9.mongodb.net:27017/ForumApp?ssl=true&replicaSet=atlas-34plbv-shard-0&authSource=admin&retryWrites=true&w=majority";
  const client = new MongoClient(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    return client;
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

module.exports = main();
