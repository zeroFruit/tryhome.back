import expect from 'expect';
import request from 'supertest';
import faker from 'faker';

import { app } from '../app';
import Code from '../config/responseCode';
import Msg from '../config/responseMsg';
import { Site, A_SITE_INDEX, B_SITE_INDEX } from '../models/site';
import { SITE_NUM, sites, populateSites } from './seed/site.test__helper';

describe('Model Site', () => {
  beforeEach(populateSites);

  it('should upsert new site', (done) => {
    let newSite = {
      siteIndex: 1,
      siteName: faker.commerce.productName(),
      categories: ['a', 'b', 'c', 'd', 'e', 'f']
    }

    Site.editSite(newSite).then((site) => {
      Site.find({ siteIndex: newSite.siteIndex }, (err, _site) => {
        if (err) {
          return done(err);
        }

        expect(_site.length).toBe(1);
        expect(_site[0]).toInclude({siteIndex: 1, siteName: newSite.siteName });
        done();
      })
    }).catch((err) => done(err));
  });

  it('should fetch site', (done) => {
    let siteIndex = 1;

    Site.fetchSite(siteIndex).then((site) => {
      expect(site).toInclude({siteName: sites[0].siteName});
      done();
    }).catch((err) => done(err));
  });

  it('should check whether site collection has two documents', (done) => {
    Site.checkSiteExist().then((msg) => {
      expect(msg).toNotEqual(false);
      done();
    })
  });
});

describe('GET /api/site', () => {
  beforeEach(populateSites);

  it('should success fetch site data', (done) => {
    request(app)
      .get('/api/site')
      .query({siteIndex: A_SITE_INDEX})
      .expect(200)
      .expect((res) => {
        expect(res.body.data.msg).toEqual(Msg.SITE_EXIST);
        expect(res.body.data.site).toInclude({siteName: sites[0].siteName});
      })
      .end(done)
  });

  it('should return SITE_NOT_EXIST message', (done) => {
    Site.remove({ siteIndex: A_SITE_INDEX }, (err) => {
      if (err) {
        return done(err);
      }

      request(app)
        .get('/api/site')
        .query({siteIndex: A_SITE_INDEX})
        .expect(200)
        .expect((res) => {
          expect(res.body.data.msg).toEqual(Msg.SITE_NOT_EXIST);
          expect(res.body.data.site).toEqual(null);
        })
        .end(done);
    });
  })
});

describe('PUT /api/site', () => {
  it('should success edit site data', (done) => {
    let newSite = {
      siteIndex: A_SITE_INDEX,
      siteName: faker.commerce.productName(),
      categories: ['aa', 'bb', 'cc', 'dd', 'ee', 'ff']
    };

    request(app)
      .put('/api/site')
      .send(newSite)
      .expect(200)
      .expect((res) => {
        expect(res.body.data.site).toInclude({ siteIndex: newSite.siteIndex, siteName: newSite.siteName });
      })
      .end(done);
  })
});

describe('GET /api/site/exist', () => {
  it('should successfully return true', (done) => {
    request(app)
      .get('/api/site/exist')
      .expect(200)
      .expect((res) => {
        expect(res.body.data.result).toBe(true);
      })
      .end(done);
  });

  it('should successfully return false', (done) => {
    Site.remove({ siteIndex: A_SITE_INDEX }, (err) => {
      if (err) {
        return done(err);
      }

      request(app)
        .get('/api/site/exist')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.result).toBe(false);
        })
        .end(done);
    });
  })
})
