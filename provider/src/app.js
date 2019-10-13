const express = require('express');
const expressPinoLogger = require('express-pino-logger');
const joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const mongodb = require('mongodb');

const basicAuthMiddleware = require('./basic-auth-middleware');
const createNote = require('./create-note');
const createOAuth2AuthorizationCode = require('./create-oauth2-authorization-code');
const deleteNote = require('./delete-note');
const getNotes = require('./get-notes');
const getOAuth2Client = require('./get-oauth2-client');
const join = require('./join');
const logger = require('./logger');
const login = require('./login');
const reqContainerMiddleware = require('./req-container-middleware');
const reqIDMiddleware = require('./req-id-middleware');
const tokenMiddleware = require('./token-middleware');

const app = express();

app.use(reqIDMiddleware);
app.use(expressPinoLogger({ logger }));
app.use(reqContainerMiddleware);

/**
 * RFC 6749 §3.1
 *
 * The authorization server MUST support the use of the HTTP "GET"
 * method for the authorization endpoint and MAY support the use
 * of the "POST" method as well.
 */
//app.get('/authorize', (req, res) => res.sendStatus(501));

app.post('/oauth2/authorize', tokenMiddleware, express.json(), createOAuth2AuthorizationCode);

const tokenSchema = joi.object().unknown(false).keys({
  grant_type: joi.string().valid('authorization_code').required(),
  code: joi.string().required(),
});

/**
 * RFC 6749 §3.2
 *
 * The client MUST use the HTTP "POST" method when making
 * token requests.
 */
app.post('/oauth2/token', basicAuthMiddleware, express.urlencoded(), async (req, res) => {
  const { error, value } = tokenSchema.validate(req.body);

  if (error) {
    logger.info({ error }, 'Invalid OAuth 2 token request.');
    return res.status(400).json({ error }).end();
  }

  let code;

  try {
    code = mongodb.ObjectId(value.code);
  } catch (err) {
    logger.info({ err }, 'Invalid OAuth 2 code provided for token request.');
    return res.status(400).end();
  }

  const criteria = { _id: code };
  const dao = req.container.get('dao');
  const authCode = await dao.oauth2AuthorizationCodes().findOne(criteria);

  if (!authCode) {
    logger.info({ code }, 'Unable to find auth code provided for OAuth 2 token request.');
    return res.status(400).end();
  }

  if (authCode.clientID !== String(req.client._id)) {
    logger.info({ code }, 'Auth code not assigned to authenticated client.');
    return res.status(400).end();
  }

  const tokenPayload = {
    exp: Date.now() + 1000 * 60,
    iat: Date.now(),
    iss: 'oauth2-provider.localhost',
    aud: 'oauth2-provider.localhost',
    sub: authCode.userID,
    scope: authCode.scope.join(' '),
    client_id: authCode.clientID,
  };

  const token = jwt.sign(tokenPayload, 'secret');

  return res.status(200)
    .set('Cache-Control', 'no-cache, no-store')
    .set('Pragma', 'no-cache')
    .json({ access_token: token, token_type: 'Bearer' })
    .end();
});

app.post('/join', express.json(), join);
app.post('/login', express.json(), login);

app.get('/oauth2/clients/:clientID', getOAuth2Client);

app.post('/api/v1/notes', tokenMiddleware, express.json(), createNote);
app.get('/api/v1/notes', tokenMiddleware, getNotes);
app.delete('/api/v1/notes/:noteID', tokenMiddleware, deleteNote);

module.exports = app;
