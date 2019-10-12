const mongodb = require('mongodb');

const cache = new Map();

async function getDBConnection(dbUrl) {
  if (!cache.has(dbUrl)) {
    const connection = await mongodb.MongoClient.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    cache.set(dbUrl, connection);
  }

  return cache.get(dbUrl);
}

module.exports = getDBConnection;
