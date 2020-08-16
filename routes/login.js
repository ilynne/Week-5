
const { Router } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const { isAuthorized, passwordPresent, emailAndPassword } = require("./middleware.js")
const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token')

// maybe delete this route -- we don't need it
// Logout
router.post("/logout", async (req, res, next) => {
  res.sendStatus(404);
})

// Password
router.post("/password", isAuthorized, passwordPresent, async (req, res, next) => {
  const { user } = req;
  const { password } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    await userDAO.updateUserPassword(user._id, encryptedPassword);
    res.status(200).send('success')
  } catch(e) {
    next(e);
  }
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
  if (error instanceof userDAO.BadDataError) {
    res.status(409).send(error.message);
  } else {
    res.status(500).send('something went wrong');
  }
});

module.exports = router;
