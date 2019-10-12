const bcrypt = require('bcrypt');
const express = require('express');
const expressPinoLogger = require('express-pino-logger');
const joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
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

function viewUser({ _id, passwordHash, ...rest }) {
  return {
    id: String(_id),
    ...rest,
  };
}

const userSchema = joi.object().unknown(false).keys({
  email: joi.string().email().trim().lowercase().required(),
  password: joi.string().required(),
});

app.post('/join', express.json(), async (req, res) => {
  const db = await getDBConnection();

  const { error, value } = userSchema.validate(req.body);
  const { password, ...user } = value;

  if (error) {
    return res.status(400)
      .json({ error })
      .end();
  }

  const emailTaken = await db.db('oauth2_provider_db').collection('users').findOne({ email: user.email })

  if (emailTaken) {
    return res.status(400).end();
  }

  const passwordHash = await bcrypt.hash(password, 10);

  Object.assign(user, { createdAt: Date.now(), passwordHash });

  await db.db('oauth2_provider_db').collection('users').insertOne(user);

  res.status(201)
    .json(viewUser(user))
    .end();
});

const loginSchema = joi.object().unknown(false).keys({
  email: joi.string().trim().lowercase().email().required(),
  password: joi.string().required(),
});

app.post('/login', express.json(), async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error }).end();
  }

  const db = await getDBConnection();
  const criteria = { email: value.email };
  const user = await db.db('oauth2_provider_db').collection('users').findOne(criteria);

  if (!user) {
    return res.status(401).end();
  }

  const passwordIsGood = await bcrypt.compare(value.password, user.passwordHash);

  if (!passwordIsGood) {
    return res.status(401).end();
  }

  const tokenPayload = {
    exp: Date.now() + 1000 * 60,
    iat: Date.now(),
    iss: 'oauth2-provider.localhost',
    aud: 'oauth2-provider.localhost',
    sub: String(user._id),
  };

  const token = jwt.sign(tokenPayload, 'secret');

  return res.status(200)
    .set('Cache-Control', 'no-cache, no-store')
    .set('Pragma', 'no-cache')
    .json({ access_token: token, token_type: 'Bearer' })
    .end();
});

module.exports = app;
