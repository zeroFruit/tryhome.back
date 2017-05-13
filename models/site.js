import { mongoose } from '../config/mongodb';
import moment from 'moment-timezone';
import logger from '../config/logger';

const A_SITE_INDEX = 1;
const B_SITE_INDEX = 2;

const SiteSchema = new mongoose.Schema({
  date:       { type: Date, default: Date.now },
  siteIndex:  { type: Number },
  siteName:   { type: String },
  categories: [{ type: String }]
});

const SITE_QUERY_MASK = { date: 0, __v: 0 };

SiteSchema.statics.editSite = function (site) {
  let Site = this;

  return new Promise((resolve, reject) => {
    Site.update(
      { siteIndex: site.siteIndex },
      { $set: site },
      { upsert: true, setDefaultsOnInsert: true },
      (err, res) => {
        if (err) {
          logger.log('error', '[models/editSite]', err);
          return reject(err);
        }

        logger.log('info', '[models/editSite]', 'Site Updated', site);
        return resolve(site);
      }
    )
  })
}

SiteSchema.statics.fetchSite = function (siteIndex) {
  let Site = this;

  return new Promise((resolve, reject) => {
    Site.findOne({ siteIndex }, (err, site) => {
      if (err) {
        logger.log('error', '[models/fetchSite]', err);
        return reject(err);
      }
      if (!site) {
        logger.log('info', '[models/fetchSite]', 'Sites Not Exist');
        return resolve();
      }
      logger.log('info', '[models/fetchSite]', 'Site Fetched');
      return resolve(site);
    })
  })
}

SiteSchema.statics.checkSiteExist = function () {
  let Site = this;

  return new Promise((resolve, reject) => {
    Site.find({}, (err, sites) => {
      if (err) {
        logger.log('error', '[models/checkSiteExist]', err);
        return reject(err);
      }

      if (sites.length < 2 && sites.length >= 0) {
        logger.log('info', '[models/checkSiteExist]', 'Sites Is not Enough');
        return resolve(false);
      } else if (sites.length > 2) {
        logger.log('error', '[models/checkSiteExist]', 'Sites are too Many');
        return reject();
      } else {
        logger.log('info', '[models/checkSiteExist]', 'Sites are set');
        return resolve(true);
      }
    })
  })
}

const Site = mongoose.model('Site', SiteSchema);

module.exports = {
  A_SITE_INDEX,
  B_SITE_INDEX,
  Site
};
