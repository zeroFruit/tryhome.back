import "../config/env/env";

import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import logger from '../config/logger';
import Hashids from 'hashids';

AWS.config.region = 'ap-northeast-2';
AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const S3 = new AWS.S3();
const BUCKET_NAME = 'try-home';

const uploadDescImg = (imgFile, callback) => {
  const { name, type, path } = imgFile.desc;
  const newKey = `${Date.now()}-${name}`;
  const params = {
    Bucket: BUCKET_NAME,
    Key: newKey,
    ACL: 'public-read',
    Body: fs.createReadStream(path),
    ContentType: type
  };

  S3.upload(params, (err, { Key, Location }) => {
    if (err) {
      logger.log('error', '[helper/uploadDescImg]', err);
      return callback(err);
    }
    return callback(null, { Key, Location });
  })
}

const delDescImg = (Key, callback) => {
  const params = {
    Key,
    Bucket: BUCKET_NAME
  };

  S3.deleteObject(params, (err) => {
    if (err) {
      logger.log('error', '[helper/delDescImg]', err);
      return callback(err);
    }
    return callback(null);
  })
}

const responseByCode = (res, code, status = 200) => {
  return res.status(status).json({code});
}

const responseByCodeWithData = (res, code, status = 200, data = null) => {
  return res.status(status).json({code, data});
}

const isObjectKeyExist = (obj, mask) => {
  let exist = 0;

  mask.forEach((m) => {
    if (m in obj) {
      exist++;
    }
  });

  return exist === mask.length;
}

const items2orders = (items) => {
  let orders = items.map(item => {
    let { color, size, count } = item;
    let { label, price, siteIndex, category } = item.item;
    return { color, size, count, label, price, siteIndex, category }
  });

  return orders;
}

const createOrderId = _id => {
  return new Hashids().encodeHex(_id);
}

const splitCommaStr = str => {
  return str.split(',');
}
module.exports = {
  uploadDescImg,
  delDescImg,
  responseByCode,
  responseByCodeWithData,
  isObjectKeyExist,
  items2orders,
  createOrderId,
  splitCommaStr
}
