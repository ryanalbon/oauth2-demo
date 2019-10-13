const joi = require('@hapi/joi');

const viewNote = require('./view-note');

const noteSchema = joi.object().unknown(false).keys({
  body: joi.string().trim().required(),
});

async function createNote(req, res) {
  const { error, value } = noteSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error }).end();
  }

  const note = {
    ...value,
    createdAt: Date.now(),
    userID: req.token.sub,
  };

  await req.container.get('dao').notes().insertOne(note);

  res.status(201).json(viewNote(note)).end();
}

module.exports = createNote;
