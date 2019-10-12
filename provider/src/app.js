const express = require('express');
const expressPinoLogger = require('express-pino-logger');
const mongodb = require('mongodb');

const logger = require('./logger');

const app = express();

const cache = new Map();

async function getDBConnection() {
  const CACHE_KEY = 'db_connection';

  if (!cache.has(CACHE_KEY)) {
    const connection = await mongodb.MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true, useUnifiedTopology: true });
    cache.set(CACHE_KEY, connection);
  }

  return cache.get(CACHE_KEY);
}

app.use(expressPinoLogger({ logger }));

/**
 * RFC 6749 §3.1
 *
 * The authorization server MUST support the use of the HTTP "GET"
 * method for the authorization endpoint and MAY support the use
 * of the "POST" method as well.
 */
app.get('/authorize', (req, res) => res.sendStatus(501));

/**
 * RFC 6749 §3.2
 *
 * The client MUST use the HTTP "POST" method when making
 * token requests.
 */
app.post('/token', (req, res) => res.sendStatus(501));

function viewUser({ _id, password, ...rest }) {
  return {
    id: String(_id),
    ...rest,
  };
}

app.post('/join', express.json(), async (req, res) => {
  const db = await getDBConnection();

  const user = {
    ...req.body,
    createdAt: new Date(),
  };

  await db.db('oauth2_provider_db').collection('users').insertOne(user);

  res.status(201)
    .json(viewUser(user))
    .end();
});

app.post('/login', (req, res) => res.sendStatus(501));

module.exports = app;
