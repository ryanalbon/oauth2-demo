const axios = require('axios');
const express = require('express');
const expressPinoLogger = require('express-pino-logger');

const logger = require('./logger');

const app = express();

app.use(expressPinoLogger({ logger }));

app.post('/oauth2/callback', express.json(), async (req, res) => {
  const grant_type = 'authorization_code';
  const code = req.body.code;
  const credentials = Buffer.from(`5da32fda8023c689fc2f0dcc:alpha`).toString('base64');
  const authorization = `Basic ${credentials}`;
  const payload = `grant_type=${grant_type}&code=${code}`;
  const headers = {
    authorization,
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const response = await axios.post('http://127.0.0.1:5000/oauth2/token', payload, { headers });

  return res.status(200).json({ data: response.data }).end();
});

module.exports = app;
