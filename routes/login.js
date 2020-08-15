
const { Router } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const { isAuthorized, emailAndPassword } = require("./middleware.js")
const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token')
const User = require('../models/user');


// Logout
router.post("/logout", async (req, res, next) => {
  res.sendStatus(404);
})

// Password
router.post("/password", isAuthorized, emailAndPassword, async (req, res, next) => {
  const {email, password } = req.body
  res.sendStatus(401);
  next();
})

// Signup
router.post("/signup", emailAndPassword, async (req, res, next) => {
  const { email, password } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await userDAO.createUser({ email: email,
                                            password: encryptedPassword,
                                            roles: ['user'] });
    res.json(user);
  } catch(e) {
    next(e);
  }
})

// Login
router.post("/", emailAndPassword, async (req, res, next) => {
  const { email, password } = req.body
  try {
    const user = await userDAO.getUser(email);
    if (user && await bcrypt.compare(password, user.password)) {
      try {
        const token = await tokenDAO.getTokenForUser(user)
        // const token = jwt.sign( user, secret)
        res.json({ token: token })
      } catch(e) {
        next(e);
      }
    } else {
      res.status(401).send('invalid login')
    }
  } catch(e) {
    next(e)
  }
});

// errors
router.use(async (error, req, res, next) => {
  console.log('error', error)
  if (error instanceof userDAO.BadDataError) {
    res.status(409).send(error.message);
  } else {
    res.status(500).send('something went wrong');
  }
});

module.exports = router;
