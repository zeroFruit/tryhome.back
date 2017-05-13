import { ObjectID } from 'mongodb';
import faker from 'faker';

import { Site } from '../../models/site';

const SITE_NUM = 2;
let sites = [];

for (var i = 0; i < SITE_NUM; i++) {
  sites.push({
    _id: new ObjectID(),
    siteName: faker.company.companyName(),
    siteIndex: (i+1),
    categories: ['a', 'b', 'c', 'd', 'e', 'f']
  });
}

const populateSites = (done) => {
  Site.remove({}).then(() => {
    let SitePromises = sites.map(site => new Site(site).save());

    return Promise.all(SitePromises).then(() => done());
  })
}

module.exports = {
  sites,
  populateSites
}
