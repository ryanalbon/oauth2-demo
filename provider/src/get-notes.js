const viewNote = require('./view-note');

async function getNotes(req, res) {
  const dao = req.container.get('dao');
  const criteria = { userID: req.token.sub };
  const result = await dao.notes().find(criteria).toArray();

  return res.status(200)
    .json(result.map(viewNote))
    .end();
}

module.exports = getNotes;
