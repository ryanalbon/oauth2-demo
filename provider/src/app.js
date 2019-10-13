const express = require('express');
const expressPinoLogger = require('express-pino-logger');

const createNote = require('./create-note');
const deleteNote = require('./delete-note');
const getNotes = require('./get-notes');
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
app.get('/authorize', (req, res) => res.sendStatus(501));

/**
 * RFC 6749 §3.2
 *
 * The client MUST use the HTTP "POST" method when making
 * token requests.
 */
app.post('/token', (req, res) => res.sendStatus(501));

app.post('/join', express.json(), join);
app.post('/login', express.json(), login);

app.post('/api/v1/notes', tokenMiddleware, express.json(), createNote);
app.get('/api/v1/notes', tokenMiddleware, getNotes);
app.delete('/api/v1/notes/:noteID', tokenMiddleware, deleteNote);

module.exports = app;
