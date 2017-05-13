import { ObjectID } from 'mongodb';
import faker from 'faker';

import { Item } from '../../models/item';

const ITEM_NUM = 3;
let items = [];

for (var i = 0; i < ITEM_NUM; i++) {
  let siteIndex;

  if (i%2 === 0) {
    siteIndex = 1;
  } else {
    siteIndex = 2;
  }

  items.push({
    _id: new ObjectID(),
    siteIndex,
    label: faker.commerce.productName(),
    size: "['S', 'M', 'L']",
    color: "['R', 'G', 'B']",
    desc: faker.image.imageUrl(),
    price: faker.random.number(),
    avail: faker.random.boolean()
  });
}

const populateItems = (done) => {
  Item.remove({}).then(() => {
    let ItemPromises = items.map(item => new Item(item).save());

    return Promise.all(ItemPromises).then(() => done());
  })
};

module.exports = {
  ITEM_NUM,
  items,
  populateItems
}
