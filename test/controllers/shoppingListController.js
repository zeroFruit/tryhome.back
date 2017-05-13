import '../../config/env/env';
import _pick from 'lodash/pick'
import Code from '../../config/responseCode';
import logger from '../../config/logger';
import {
  responseByCode,
  responseByCodeWithData,
  isObjectKeyExist,
  items2orders,
  createOrderId
} from '../../helpers/helper';

import { ShoppingList } from '../../models/shoppinglist';

const SHIPPING_LIST_MASK = ['size', 'color', 'item', 'count'];
const CUSTOMER_MASK = ['name', 'email', 'phonenumber', 'address'];
const INDEX_MASK = ['index'];

const addShoppingList = (req, res) => {
  console.log('req.body', req.body);
  let items = req.body.items.filter(item => {
    return isObjectKeyExist(item, SHIPPING_LIST_MASK);
  });

  if (items.length !== req.body.items.length || !isObjectKeyExist(req.body.customer, CUSTOMER_MASK)) {
    logger.log('error', '[controller/addShoppingList]', 'insufficient params');
    return responseByCode(res, Code.PARAMS_INSUFF, 400);
  }
  let shoppingList = new ShoppingList();
  shoppingList.orders = items2orders(items);
  shoppingList.orderId = createOrderId(shoppingList._id);
  shoppingList.customer = req.body.customer;

  shoppingList.addList().then(list => {
    logger.log('info', '[controller/addList]');
    return responseByCodeWithData(res, Code.POST_SUCCESS, 200, { list });
  }).catch(err => {
    logger.log('error', '[controller/addList]');
    return responseByCode(res, Code.POST_FAIL, 400);
  })
}

const fetchShoppingList = (req, res) => {
  try {
    if (!isObjectKeyExist(req.query, INDEX_MASK)) {
      logger.log('error', '[controller/fetchShoppingList]', 'insufficient params');
      return responseByCode(res, Code.PARAMS_INSUFF, 400);
    }
    let index = _pick(req.query, INDEX_MASK);
    ShoppingList.fetchList(index).then(list => {
      logger.log('info', '[controller/fetchShoppingList]');
      return responseByCodeWithData(res, Code.GET_SUCCESS, 200, { list });
    }).catch(err => {
      logger.log('error', '[controller/fetchShoppingList]');
      return responseByCode(res, Code.GET_FAIL, 400);
    })
  } catch (err) {
    logger.log('error', '[controller/fetchShoppingList]', err);
  }
}

module.exports = {
  addShoppingList,
  fetchShoppingList
}
