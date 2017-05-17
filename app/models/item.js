import { mongoose } from '../config/mongodb';
import moment from 'moment-timezone';
import logger from '../config/logger';

const ItemSchema = new mongoose.Schema({
  date:       { type: Date, default: Date.now },
  siteIndex:  { type: Number, required: true },
  label:      { type: String, required: true},
  color:      [{ type: String }],
  size:       [{ type: String }],
  imgKey:     { type: String },
  imgLink:    { type: String},
  price:      { type: Number },
  avail:      { type: Boolean },
  category:   { type: String }
});

const ITEM_QUERY_MASK = { date: 0, __v: 0 };
const ITEMS_PER_PAGE = 10;

ItemSchema.statics.size = function (siteIndex) {
  let Item = this;

  return new Promise((resolve, reject) => {
    return Item.find({ siteIndex })
      .then(items => {
        resolve(items.length)
      })
      .catch(err => {
        logger.log('error', '[models/size]', err);
        reject(err);
      })
  })
}

ItemSchema.methods.addItem = function () {
  let item = this;

  return new Promise((resolve, reject) => {
    return item.save()
      .then(() => resolve(item))
      .catch((err) => {
        logger.log('error', '[models/addItem]', err);
        reject(err);
      });
  });
}

ItemSchema.statics.removeItem = function (_id) {
  let Item = this;

  return new Promise((resolve, reject) => {
    Item.findOneAndRemove({ _id }, null, (err, item) => {
      if (err) {
        logger.log('error', '[models/removeItem]', err);
        reject(err);
      } else if (item) {
        resolve(item);
      } else {
        logger.log('error', '[models/removeItem]', 'No Item Found');
        reject();
      }
    })
  });
}

ItemSchema.statics.updateItem = function (item) {
  let Item = this;

  return new Promise((resolve, reject) => {
    Item.findByIdAndUpdate(item._id, { $set: item }, { new: false },
      (err, oldItem) => {
        if (err) {
          logger.log('error', '[models/updateItem]', err)
          return reject(err);
        } else {
          resolve(oldItem);
        }
      }
    );
  })
}

ItemSchema.statics.getItemsBySite = function (siteIndex, page=0) {
  let Item = this;

  return new Promise((resolve, reject) => {
    return Item.find({ siteIndex }, ITEM_QUERY_MASK)
      .sort({date: -1})
      .skip(page * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .then((items) => {
        resolve({ list: items, page });

      }).catch((err) => {
        logger.log('error', '[models/getItemsBySite]', err);
        reject(err);
      });
  });
}

ItemSchema.statics.getAllItemsBySite = function (siteIndex) {
  let Item = this;

  return new Promise((resolve, reject) => {
    return Item.find({}, ITEM_QUERY_MASK)
      .then(items => resolve(items))
      .catch(err => {
        logger.log('error', '[models/getItemsBySite]', err);
        reject(err);
      })
  })
}

const Item = mongoose.model('Item', ItemSchema);

module.exports = { Item };
