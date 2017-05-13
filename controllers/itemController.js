import '../config/env/env';

import _pick      from 'lodash/pick';
import _omit      from 'lodash/omit';
import formidable from 'formidable';

import Code       from '../config/responseCode';
import logger     from '../config/logger';
import {
  uploadDescImg,
  delDescImg,
  responseByCode,
  responseByCodeWithData,
  isObjectKeyExist,
  splitCommaStr
} from '../helpers/helper';

import { Item } from '../models/item';

const ITEM_MASK = ['siteIndex', 'label', 'color', 'size', 'price', 'category'];
/**
  새 상품 등록

  POST /api/item

  최종 수정일: 17.4.13
*/
const createItem = (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      logger.log('error', '[controller/createItem]', 'formidable');
      return responseByCode(res, Code.POST_FAIL, 400);
    }
    console.log('fields', fields);

    if (!isObjectKeyExist(fields, ITEM_MASK)) {
      logger.log('error', '[controller/createItem]', 'insufficient params');
      return responseByCode(res, Code.PARAMS_INSUFF, 400);
    }

    let item = _pick(fields, ITEM_MASK);
    item.color = splitCommaStr(item.color);
    item.size = splitCommaStr(item.size);
    console.log('item.color', item.color, item.color.length);

    uploadDescImg(files, (err, result) => {
      if (err) {
        logger.log('error', '[controller/createItem]');
        return responseByCode(res, Code.POST_FAIL, 400);
      }

      new Item({ ...item, imgKey: result.Key, imgLink: result.Location }).addItem()
      .then((_item) => {
        logger.log('info', '[controller/createItem]', 'success');
        return responseByCodeWithData(res, Code.POST_SUCCESS, 200, _item);
      })
      .catch((err) => {
        logger.log('error', '[controller/createItem]');
        return responseByCode(res, Code.POST_FAIL, 400);
      });
    });
  });

}


/**
  상품들 불러오기

  GET /api/item

  최종 수정일: 17.4.13
*/
const fetchItems = (req, res) => {
  if (!req.query.siteIndex || !req.query.page) {
    logger.log('error', '[controller/fetchItems]', 'insufficient params');
    return responseByCode(res, Code.PARAMS_INSUFF, 400);
  }

  let siteIndex = req.query.siteIndex;
  let page = req.query.page;

  let getItemsPromise = Item.getItemsBySite(siteIndex, page);
  let sizePromise = Item.size(siteIndex);

  Promise.all([sizePromise, getItemsPromise]).then(results => {
    logger.log('info', '[controller/fetchItem]', 'success');
    responseByCodeWithData(res, Code.GET_SUCCESS, 200, { size: results[0], list: results[1].list, page: results[1].page});
  })
  .catch(err => {
    logger.log('error', '[controller/fetchItems]');
    responseByCode(res, Code.GET_FAIL, 400);
  });
}

const fetchAllItems = (req, res) => {
  if (!req.query.siteIndex) {
    logger.log('error', '[controller/fetchItems]', 'insufficient params');
    return responseByCode(res, Code.PARAMS_INSUFF, 400);
  }

  let siteIndex = req.query.siteIndex;

  Item.getAllItemsBySite(siteIndex).then(items => {
    logger.log('info', '[controller/fetchItem]', 'success');
    responseByCodeWithData(res, Code.GET_SUCCESS, 200, { items });
  })
  .catch(err => {
    logger.log('error', '[controller/fetchItems]');
    responseByCode(res, Code.GET_FAIL, 400);
  })
}

/**
  상품 삭제

  DELETE /api/item

  최종 수정일: 17.4.13
*/
const deleteItem = (req, res) => {
  if (!req.body._id) {
    logger.log('error', '[controller/deleteItem]', 'insufficient params');
    return responseByCode(res, Code.PARAMS_INSUFF, 400);
  }

  let iid = req.body._id;

  Item.removeItem(iid)
    .then((item) => {
      delDescImg(item.imgKey, (err) => {
        if (err) {
          logger.log('error', '[controller/deleteItem]', err);
          return responseByCode(res, Code.GET_FAIL, 400);
        }

        responseByCodeWithData(res, Code.DELETE_SUCCESS, 200, item);
      });
    })
    .catch((err) => {
      logger.log('error', '[controller/fetchItem]', err);
      return responseByCode(res, Code.GET_FAIL, 400);
    })
}

/**
  상품 정보 업데이트

  PUT /api/item

  최종 수정일: 17.4.14
*/
const updateItem = (req, res) => {
  if (!isObjectKeyExist(req.body, ITEM_MASK)) {
    logger.log('error', '[controller/updateItem]', 'insufficient params');
    return responseByCode(res, Code.PARAMS_INSUFF, 400);
  }

  let item = new Item(_pick(req.body, ITEM_MASK));

  Item.updateItem(new Item(_pick(req.body, ITEM_MASK)))
    .then((oldItem) => {
      responseByCodeWithData(res, Code.PUT_SUCCESS, 200, oldItem);
    })
    .catch((err) => {
      logger.log('error', '[controller/updateItem]');
      responseByCode(res, Code.PUT_FAIL, 400);
    });
}


module.exports = {
  createItem,
  fetchItems,
  fetchAllItems,
  deleteItem,
  updateItem
}
