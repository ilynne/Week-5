
const { Router } = require("express");
const router = Router();
const { emailAndPassword } = require("./middleware.js")

// Logout
router.post("/logout", async (req, res, next) => {
  res.sendStatus(404);
})

// Password
router.post("/password", emailAndPassword, async (req, res, next) => {
  const {email, password } = req.body
  res.sendStatus(401);
  next();
})

// Signup
router.post("/signup", emailAndPassword, async (req, res, next) => {
  res.sendStatus(200);
  next();
})

// Login
router.post("/", emailAndPassword, async (req, res, next) => {
  const { email, password } = req.body
  res.sendStatus(401);
  next();
});

// errors
router.use(async (error, req, res, next) => {
  res.status(500).send('something went wrong');
  // if (error instanceof userDAO.BadDataError) {
  //   res.status(409).send(error.message);
  // } else {
  //   res.status(500).send('something went wrong');
  // }
});

module.exports = router;
