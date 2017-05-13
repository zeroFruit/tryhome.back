import expect from 'expect';
import request from 'supertest';
import faker from 'faker';
import { ObjectID } from 'mongodb';

import { app } from '../app';
import Code from '../config/responseCode';
import logger from '../config/logger';

import {
  clearShoppingList,
  shoppinglists,
  populateList
} from './seed/shoppinglist.test__helper';
import { ShoppingList } from '../models/shoppinglist';

describe('POST /api/shoppinglist', () => {
  afterEach(clearShoppingList);

  it('should add new shoppinglist', (done) => {
    let body = {
      items: [{
        color: faker.internet.color(),
        count: 2,
        size: 's',
        item: {
          color: ['r', 'g'],
          imgKey: faker.image.image(),
          imgLink: faker.image.imageUrl(),
          label: faker.lorem.word(),
          price: faker.commerce.price(),
          siteIndex: '1',
          size: ['s', 'm'],
          _id: new ObjectID()
        }
      }],
      customer: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        phonenumber: faker.phone.phoneNumber(),
        address: faker.address.streetAddress()
      }
    };
    request(app)
      .post('/api/shoppinglist')
      .send(body)
      .expect(200)
      .expect(res => {

      })
      .end(done)
  })
});

describe.only('GET /api/shoppinglist', () => {
  beforeEach(populateList);

  it('should fetch shopping list', (done) => {
    request(app)
      .get('/api/shoppinglist')
      .query({ index: 0 })
      .expect(200)
      .expect(res => {

      })
      .end(done);
  })
})
