const mongodb = require('mongodb');

async function basicAuthMiddleware(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).end();
  }

  if (!authorization.startsWith('Basic ')) {
    return res.status(401).end();
  }

  const encodedCredentials = authorization.slice('Basic '.length);
  const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf8');
  const firstColon = decodedCredentials.indexOf(':');
  const clientID = decodedCredentials.slice(0, firstColon);
  const clientSecret = decodedCredentials.slice(firstColon + 1);

  try {
    const criteria = {
      _id: mongodb.ObjectId(clientID),
    };

    const client = await req.container.get('dao').oauth2Clients().findOne(criteria);

    if (!client) {
      return res.status(401).end();
    }

    if (client.secret !== clientSecret) {
      return res.status(401).end();
    }

    req.client = client;

    next();
  } catch (err) {
    return res.status(401).end();
  }
}

module.exports = basicAuthMiddleware;
