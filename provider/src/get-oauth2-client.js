const mongodb = require('mongodb');

function viewOAuth2Client({ _id, scope, name }) {
  return {
    id: String(_id),
    scope,
    name,
  };
}

async function getOAuth2Client(req, res) {
  let clientID;

  try {
    clientID = mongodb.ObjectId(req.params.clientID);
  } catch (err) {
    return res.status(404).end();
  }

  const dao = req.container.get('dao');
  const criteria = { _id: clientID };
  const oauth2Client = await dao.oauth2Clients().findOne(criteria);

  if (!oauth2Client) {
    return res.status(404).end();
  }

  return res.status(200)
    .json(viewOAuth2Client(oauth2Client))
    .end();
}

module.exports = getOAuth2Client;
