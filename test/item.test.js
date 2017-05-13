import _forOwn from 'lodash/forOwn';
import expect from 'expect';
import request from 'supertest';
import faker from 'faker';
import FormData from 'form-data';

import { app } from '../app';
import Code from '../config/responseCode';
import logger from '../config/logger';
import { Item } from '../models/item';
import { ITEM_NUM, items, populateItems } from './seed/item.test__helper';

describe('Model Item', () => {
  beforeEach(populateItems);

  it('should add new item', (done) => {
    let newItem = new Item({
      siteIndex: 1,
      label: faker.commerce.productName(),
      size: ['S', 'M', 'L'],
      color: ['R', 'G', 'B'],
      desc: faker.image.imageUrl(),
      price: faker.random.number(),
      avail: faker.random.boolean()
    });

    newItem.addItem().then((item) => {
      Item.find({}).then((items) => {
        expect(items.length).toBe(ITEM_NUM + 1);
        expect(item).toInclude(newItem);
        done();
      });
    })

  });

  it('should remove a item', (done) => {
    Item.removeItem(items[0]).then((item) => {
      expect(item).toInclude({siteIndex: items[0].siteIndex, label: items[0].label});

      Item.find({}).then((items) => {
        expect(items.length).toBe(ITEM_NUM - 1);
        done();
      })
    }).catch((err) => done(err));
  });

  it('should update a item', (done) => {
    let newItem = new Item({
      _id: items[0]._id,
      siteIndex: 1,
      label: faker.commerce.productName(),
      size: ['S', 'M', 'L'],
      color: ['R', 'G', 'B'],
      desc: faker.image.imageUrl(),
      price: faker.random.number(),
      avail: faker.random.boolean()
    });

    Item.updateItem(newItem).then((item) => {
      expect(item._id).toEqual(items[0]._id);

      Item.findById(items[0]._id).then((item) => {
        expect(item).toInclude({siteIndex: newItem.siteIndex, label: newItem.label});
        done();
      })
    }).catch((err) => done(err));
  });

  it('should get items by site value', (done) => {
    Item.getItemsBySite(items[0].siteIndex).then((items) => {
      expect(items.length).toBe( (ITEM_NUM + 1) / 2 );
      done();
    })
  });
});

describe('POST /api/item', () => {
  beforeEach(populateItems);

  xit('should success create new item', (done) => {
    let newItem = {
      siteIndex: 1,
      label: faker.commerce.productName(),
      size: "['S', 'M', 'L']",
      color: "['R', 'G', 'B']",
      desc: faker.image.imageUrl(),
      price: faker.random.number(),
      avail: faker.random.boolean()
    };

    let formData = new FormData();

    Object.keys(newItem).forEach((key) => {
      formData.append(key, newItem[key]);
    });

    request(app)
      .post('/api/item')
      .set({'content-type': 'multipart/form-data'})
      .send(formData)
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toInclude(newItem);
        expect(res.body.code).toBe(Code.POST_SUCCESS);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        return done();
      });
  });
})

describe('GET /api/item', (done) => {
  it('should success fetching items', (done) => {
    request(app)
      .get('/api/item')
      .query({siteIndex: items[0].siteIndex})
      .expect(200)
      .expect((res) => {
        expect(res.body.data.length).toBe( (ITEM_NUM + 1) / 2 );
        expect(res.body.code).toBe(Code.GET_SUCCESS);
        expect(items[0]).toInclude(res.body.data[0]);
      })
      .end(done);
  })
});

describe('DELETE /api/item', (done) => {
  it('should success deleting item', (done) => {
    request(app)
      .delete('/api/item')
      .send({_id: items[0]._id})
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toInclude({label: items[0].label});
        expect(res.body.code).toBe(Code.DELETE_SUCCESS);
      })
      .end(done);
  })
})
