const jwt = require('jsonwebtoken');

const secret = 'my super secret';

module.exports = {};

module.exports.getTokenForUser = async (user) => {
  const data = { _id: user._id, email: user.email, roles: user.roles }
  return await jwt.sign(data, secret, { expiresIn: '1 day' });
}

module.exports.getUserFromToken = async (token) => {
  return await jwt.verify(token, secret);
}
