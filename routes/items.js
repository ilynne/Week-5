
const { Router } = require("express");
const router = Router();
const { isAuthorized, isAdmin } = require("./middleware.js");
const itemDao = require('../daos/item');

router.put("/:id", isAuthorized, isAdmin, async (req, res, next) => {
  const { id } = req.params;
  const { title, price } = req.body;
  try {
    data = { title: title, price: price }
    console.log(id)
    const item = await itemDao.updateItem(id, data);
    res.json(item);
  } catch(e) {
    next(e);
  }
})

router.post("/", isAuthorized, isAdmin, async (req, res, next) => {
  const { title, price } = req.body;
  try {
    data = { title: title, price: price }
    const item = await itemDao.createItem(data);
    res.json(item);
  } catch(e) {
    next(e);
  }
})

router.get("/:id", isAuthorized, async (req, res, next) => {
  const { id } = req.params;
  try {
    const item = await itemDao.getItem(id);
    res.json(item);
  } catch(e) {
    next(e)
  }
})

router.get("/", isAuthorized, async (req, res, next) => {
  let { page, perPage } = req.query;
  page = page ? Number(page) : 0;
  perPage = perPage ? Number(perPage) : 10;
  const items = await itemDao.getAll(page, perPage);
  res.json(items);
})

// errors
router.use(async (error, req, res, next) => {
  if (error instanceof itemDao.BadDataError) {
    res.status(409).send(error.message);
  } else {
    res.status(500).send('something went wrong');
  }
});

module.exports = router;
