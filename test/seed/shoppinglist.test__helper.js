import { ObjectID } from 'mongodb';
import faker from 'faker';
import Hashids from 'hashids';

import { ShoppingList } from '../../models/shoppinglist';

const clearShoppingList = () => {
  return ShoppingList.remove({});
}

const SHOPPING_LIST_NUM = 9;
let shoppinglists = [];
for (var i = 0; i < SHOPPING_LIST_NUM; i++) {
  let _id = new ObjectID();
  let body = {
    _id,
    orders: [{
      color: faker.internet.color(),
      count: 2,
      size: 's',
      label: faker.lorem.word(),
      price: faker.commerce.price(),
      siteIndex: '1',
      _id: new ObjectID()
    }],
    customer: [{
      name: faker.name.findName(),
      email: faker.internet.email(),
      phonenumber: faker.phone.phoneNumber(),
      address: faker.address.streetAddress()
    }],
    orderId: new Hashids().encodeHex(_id)
  };

  shoppinglists.push(body);
}

const populateList = done => {
  ShoppingList.remove({}).then(() => {
    let ListPromises = shoppinglists.map(list => new ShoppingList(list).save());

    return Promise.all(ListPromises).then(() => done());
  })
}

module.exports = {
  clearShoppingList,
  shoppinglists,
  populateList
}
