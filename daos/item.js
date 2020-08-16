const Item = require('../models/item');

module.exports = {};

module.exports.createItem = async (itemObj) => {
  try {
    const item = await Item.create(itemObj);
    return item;
  } catch(e) {
    if (e.message.includes('duplicate key error')) {
      throw new BadDataError(e.message);
    }
    throw e;
  }
}

module.exports.getAll = async (page, perPage) => {
  return await Item.find().limit(perPage).skip(perPage*page).lean();
}

module.exports.getItem = async (id) => {
  try {
    return await Item.findOne({ _id: id }).lean();
  } catch(e) {
    throw e;
  }
}

module.exports.updateItem = async (id, itemObj) => {
  try {
    const { title, price } = itemObj
    return await Item.update({ _id: id }, { title: title, price: price });
  } catch(e) {
    throw e;
  }
}

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;
