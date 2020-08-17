const Order = require('../models/order');
const Item = require('../models/item');

module.exports = {};

module.exports.createOrder = async (userId, items) => {
  let total = 0;
  for (const id of items) {
    const item = await Item.findOne({ _id: id }, { price: 1 });
    total += item.price;
  }
  let data = { userId: userId, items: items, total: total };
  try {
    const order = await Order.create(data);
    return order;
  } catch(e) {
    console.log(e.message)
    throw e;
  }
}

module.exports.getOrderById = async (id) => {
  try {
    const order = await (Order.findOne({ _id: id }).lean());
    let orderItems = [];
    for (const id of order.items) {
      orderItems.push(await Item.findOne({ _id: id }, { title: 1, price: 1 }));
    }
    order.items = orderItems;
    return order;
  } catch(e) {
    if (e.message.includes("Cannot read property 'items' of null")) {
      throw new NotFoundError(e.message);
    }
    throw e;
  }
}

module.exports.getOrderByIdAndUser = async (id, userId) => {
  try {
    const order = await (Order.findOne({ _id: id, userId: userId }).lean());
    let orderItems = [];
    for (const id of order.items) {
      orderItems.push(await Item.findOne({ _id: id }, { title: 1, price: 1 }));
    }
    order.items = orderItems;
    return order;
  } catch(e) {
    if (e.message.includes("Cannot read property 'items' of null")) {
      throw new NotFoundError(e.message);
    }
    throw e;
  }
}

module.exports.getOrders = async () => {
  return await Order.find();
}

module.exports.getOrdersForUser = async (userId) => {
  return await Order.find({ userId: userId });
}

// This is me trying to lookup and failing.
// Leaving it here.
// module.exports.getOrderById = async (id, userId) => {
//   try {
//     const order = await (Order.aggregate()
//       .match({ _id: id, userId: userId })
//       .lookup({
//         from: 'Items',
//         localField: '_id',
//         foreignField: 'items',
//         as: 'items'
//       }));

//     return order;
//   } catch(e) {
//     console.log(e.message);
//     throw e;
//   }
// }

class NotFoundError extends Error {};
module.exports.NotFoundError = NotFoundError;
