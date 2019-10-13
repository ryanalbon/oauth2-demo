const bcrypt = require('bcrypt');
const express = require('express');
const joi = require('@hapi/joi');

function viewUser({ _id, passwordHash, ...rest }) {
  return {
    id: String(_id),
    ...rest,
  };
}

const userSchema = joi.object().unknown(false).keys({
  email: joi.string().email().trim().lowercase().required(),
  password: joi.string().required(),
});

async function join(req, res) {
  const { error, value } = userSchema.validate(req.body);
  const { password, ...user } = value;

  if (error) {
    return res.status(400)
      .json({ error })
      .end();
  }

  const emailTaken = await req.container.get('dao').users().findOne({ email: user.email })

  if (emailTaken) {
    return res.status(400).end();
  }

  const passwordHash = await bcrypt.hash(password, 10);

  Object.assign(user, { createdAt: Date.now(), passwordHash });

  await req.container.get('dao').users().insertOne(user);

  res.status(201)
    .json(viewUser(user))
    .end();
}

module.exports = join;
