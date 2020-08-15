// const requestTime = async (req, res, next) => {
//   console.log(`${req.method} ${req.url} at ${new Date()}`);
//   next();
// }

// const tellMeMore = async (req, res, next) => {
//   console.log('tell me more, tell me more');
//   next();
// }

const emailAndPassword = async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).send('email and password are required')
  } else {
    next();
  }
}

// exports.requestTime = requestTime;
// exports.tellMeMore = tellMeMore;
exports.emailAndPassword = emailAndPassword;
