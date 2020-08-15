const tokenDAO = require('../daos/token');

const isAuthorized = async (req, res, next) => {
  const { authorization } = req.headers
  if (authorization) {
    const token = authorization.split(' ')[1];
    if (token) {
      try {
        const user = await tokenDAO.getUserFromToken(token)
        req.user = user;
        next();
      } catch(e) {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
}

const passwordPresent = async (req, res, next) => {
  const { password } = req.body
  if (!password) {
    res.status(400).send('password is required')
  } else {
    next();
  }
}

const emailAndPassword = async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).send('email and password are required')
  } else {
    next();
  }
}
exports.isAuthorized = isAuthorized;
exports.passwordPresent = passwordPresent;
exports.emailAndPassword = emailAndPassword;
