const { Router } = require("express");
const router = Router();
const { isAuthorized, isAdmin } = require("./middleware.js");
const orderDao = require('../daos/order');

const isValidOrder = async (req, res, next) => {
  if (req.body.includes(null)) {
    res.status(400).send('invalid item id')
  } else {
    next();
  }
}

router.put("/:id", isAuthorized, async (req, res, next) => {
  res.status(200).send('success')
})

router.post("/", isAuthorized, isValidOrder, async (req, res, next) => {
  try {
    const { user } = req;
    order = await orderDao.createOrder(user._id, req.body)
    res.json(order);
  } catch(e) {
    next(e);
  }
})

router.get("/:id", isAuthorized, async (req, res, next) => {
  const { user } = req;
  const isAdmin = user.roles.includes('admin');
  try {
    const { id } = req.params;
    let order;
    if (isAdmin) {
      order = await orderDao.getOrderById(id);
    } else {
      const { user } = req;
      order = await orderDao.getOrderByIdAndUser(id, user._id);
    }
    res.json(order);
  } catch(e) {
    next(e);
  }
})

router.get("/", isAuthorized, async (req, res, next) => {
  const { user } = req;
  const isAdmin = user.roles.includes('admin');
  try {
    const { id } = req.params;
    let orders;
    if (isAdmin) {
      orders = await orderDao.getOrders();
    } else {
      const { user } = req;
      orders = await orderDao.getOrdersForUser(user._id);
    }
    res.json(orders);
  } catch(e) {
    next(e);
  }
})

// errors
router.use(async (error, req, res, next) => {
  if (error instanceof orderDao.NotFoundError) {
    res.status(404).send(error.message);
  } else {
    res.status(500).send('something went wrong');
  }
});

module.exports = router;
