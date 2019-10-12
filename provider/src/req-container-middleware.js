const config = require('./config');
const getDAO = require('./dao');
const getDBConnection = require('./db-connection');

async function reqContainerMiddleware(req, res, next) {
  const container = new Map();

  const dbConnection = await getDBConnection(config.DB_URL);
  const db = dbConnection.db(config.DB_NAME);
  const dao = getDAO(db);

  container.set('dbConnection', dbConnection);
  container.set('db', db);
  container.set('dao', dao);

  req.container = container;

  next();
}

module.exports = reqContainerMiddleware;
