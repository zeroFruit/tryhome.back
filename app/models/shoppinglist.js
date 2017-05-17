import { Schema } from 'mongoose';
import { mongoose } from '../config/mongodb';
import moment from 'moment-timezone';
import logger from '../config/logger';

import OrderSchema from './order.Schema';
import CustomerSchema from './customer.Schema';

const LIST_PER_PAGE = 10;

const ShoppingListSchema = new mongoose.Schema({
  date:     { type: Date, default: Date.now },
  orders:   [OrderSchema],
  orderId:  { type: String },
  customer: [CustomerSchema]
});

ShoppingListSchema.statics.size = function () {
  let List = this;

  return new Promise((resolve, reject) => {
    return List.find({})
      .then(lists => resolve(lists.length))
      .catch(err => {
        logger.log('error', '[models/size]', err);
        reject(err);
      })
  })
}

ShoppingListSchema.methods.addList = function () {
  let list = this;

  return new Promise((resolve, reject) => {
    return list.save()
      .then(() => resolve(list))
      .catch((err) => {
        logger.log('error', '[models/addList]', err);
        reject(err);
      })
  });
}

ShoppingListSchema.statics.fetchList = function (page = 0) {
  let List = this;

  return new Promise((resolve, reject) => {
    return List.find({})
      .sort({date: -1})
      .skip(page * LIST_PER_PAGE)
      .limit(LIST_PER_PAGE)
      .then(list => {
        resolve({ list, page })
      });
  });
}

const ShoppingList = mongoose.model('ShoppingList', ShoppingListSchema);

module.exports = { ShoppingList };
