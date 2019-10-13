const mongodb = require('mongodb');
const joi = require('@hapi/joi');

const codeSchema = joi.object().unknown(false).keys({
  clientID: joi.string().required(),
});

async function createOAuth2AuthorizationCode(req, res) {
  const { error, value } = codeSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error }).end();
  }

  let clinetID;

  try {
    clientID = mongodb.ObjectId(value.clientID);
  } catch (err) {
    return res.status(400).end();
  }

  const dao = req.container.get('dao');
  const criteria = { _id: clientID };
  const client = await dao.oauth2Clients().findOne(criteria);

  if (!client) {
    return res.status(400).end();
  }

  const code = {
    ...value,
    createdAt: Date.now(),
    userID: req.token.sub,
    scope: [ ...client.scope ],
  };

  await dao.oauth2AuthorizationCodes().insertOne(code);

  return res.status(200)
    .set('Cache-Control', 'no-cache, no-store')
    .set('Pragma', 'no-cache')
    .json({
      code: String(code._id),
      redirectURL: client.redirectURL,
    })
    .end();
}

module.exports = createOAuth2AuthorizationCode;
