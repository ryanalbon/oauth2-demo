const bcrypt = require('bcrypt');
const joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');

const loginSchema = joi.object().unknown(false).keys({
  email: joi.string().trim().lowercase().email().required(),
  password: joi.string().required(),
});

async function login(req, res) {
  const { error, value } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error }).end();
  }

  const criteria = { email: value.email };
  const user = await req.container.get('dao').users().findOne(criteria);

  if (!user) {
    return res.status(401).end();
  }

  const passwordIsGood = await bcrypt.compare(value.password, user.passwordHash);

  if (!passwordIsGood) {
    return res.status(401).end();
  }

  const tokenPayload = {
    exp: Date.now() + 1000 * 60,
    iat: Date.now(),
    iss: 'oauth2-provider.localhost',
    aud: 'oauth2-provider.localhost',
    sub: String(user._id),
  };

  const token = jwt.sign(tokenPayload, 'secret');

  return res.status(200)
    .set('Cache-Control', 'no-cache, no-store')
    .set('Pragma', 'no-cache')
    .json({ access_token: token, token_type: 'Bearer' })
    .end();
}

module.exports = login;
