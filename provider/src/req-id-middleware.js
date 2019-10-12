const uuidV4 = require('uuid/v4');

function reqIDMiddleware(req, res, next) {
  const { headers } = req;

  if (headers['x-request-id']) {
    req.id = headers['x-request-id'];
  } else {
    req.id = uuidV4();
  }

  res.set('X-Request-Id', req.id);

  next();
}

module.exports = reqIDMiddleware;
