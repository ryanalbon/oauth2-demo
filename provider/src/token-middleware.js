const jwt = require('jsonwebtoken');

async function tokenMiddleware(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(403).end();
  }

  if (!authorization.startsWith('Bearer ')) {
    return res.status(403).end();
  }

  const token = authorization.slice('Bearer '.length);

  try {
    const payload = await jwt.verify(token, 'secret');

    req.token = payload;

    next();
  } catch (err) {
    res.status(403).end();
  }
}

module.exports = tokenMiddleware;
