import '../config/env/env';

import Code from '../config/responseCode';
import Msg from '../config/responseMsg';
import logger from '../config/logger';
import {
  responseByCode,
  responseByCodeWithData,
  isObjectKeyExist,
  splitCommaStr
} from '../helpers/helper';

import {
  Site,
  A_SITE_INDEX,
  B_SITE_INDEX
} from '../models/site';

const SITE_MASK = ['siteIndex', 'siteName', 'categories'];

const fetchSite = (req, res) => {
  if (!req.query.siteIndex) {
    logger.log('error', '[controller/fetchSite]', 'insufficient params', req.query);
    return responseByCode(res, Code.PARAMS_INSUFF, 400);
  }

  let siteIndex= req.query.siteIndex;

  Site.fetchSite(siteIndex).then((site) => {
    if (!site) {
      logger.log('info', '[controller/fetchSite]', Msg.SITE_NOT_EXIST);
      return responseByCodeWithData(res, Code.GET_SUCCESS, 200, { msg: Msg.SITE_NOT_EXIST, site: null });
    }

    logger.log('info', '[controller/fetchSite]');
    return responseByCodeWithData(res, Code.GET_SUCCESS, 200, { msg: Msg.SITE_EXIST, site });
  }).catch((err) => {
    logger.log('error', '[controller/fetchSite]');
    responseByCode(res, Code.GET_FAIL, 400);
  })
}

const editSite = (req, res) => {
  if (!isObjectKeyExist(req.body, SITE_MASK)) {
    logger.log('error', '[controller/editSite]', 'insufficient params');
    return responseByCode(res, Code.PARAMS_INSUFF, 400);
  }

  req.body.categories = splitCommaStr(req.body.categories);
  req.body.siteIndex = parseInt(req.body.siteIndex);

  if (req.body.categories.length !== 6) {
    logger.log('error', '[controller/editSite]', 'insufficient categories');
    return responseByCode(res, Code.INVALID_QUERY_STRING, 400);
  }

  if (req.body.siteIndex !== A_SITE_INDEX && req.body.siteIndex !== B_SITE_INDEX) {
    logger.log('error', '[controller/editSite]', 'abnormal site index');
    return responseByCode(res, Code.PARAMS_INSUFF, 400);
  }


  Site.editSite(req.body).then((_site) => {
    logger.log('info', '[controller/editSite]');
    return responseByCodeWithData(res, Code.PUT_SUCCESS, 200, { site: _site });
  }).catch((err) => {
    logger.log('error', '[controller/editSite]');
    return responseByCode(res, Code.PUT_FAIL, 400);
  })
}

const checkSiteExist = (req, res) => {
  Site.checkSiteExist().then((result) => {
    logger.log('info', '[controller/checkSiteExist]', 'success');
    return responseByCodeWithData(res, Code.GET_SUCCESS, 200, { result });
  }).catch((err) => {
    logger.log('error', '[controller/checkSiteExist]', err);
    return responseByCode(res, Code.GET_FAIL, 400);
  })
}

module.exports = {
  fetchSite,
  editSite,
  checkSiteExist
}
