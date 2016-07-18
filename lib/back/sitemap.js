'use strict';
var sm = require('sitemap');
var router = require('express').Router();
var async = require('async');
var Video = require('./models/clip');
var New = require('./models/new');
var Game = require('./models/cat');

var sitemap = sm.createSitemap({
  hostname: 'http://www.bazivision.com',
  // cacheTime: 600000, // 600 sec - cache purge period
  cacheTime: false, // 600 sec - cache purge period
  urls: [
    { url: '/', changefreq: 'daily', priority: 1 }
  ]


});


router.get('/sitemap.xml', function(req, res, next) {
  async.parallel({
    videos: function(cb) {
      Video.find({}).stream()
        .on('data', function(item) {
          sitemap.add({
            url: item.page,
            lastmod: item.date,
            priority: 0.8,
            caption: item.title
          });
        }).on('error', cb).on('close', cb);
    },

    news: function(cb) {
      New.find({}).stream()
        .on('data', function(item) {
          sitemap.add({
            url: item.page,
            lastmod: item.date,
            priority: 0.7
          });
        }).on('error', cb).on('close', cb);
    },

    games: function(cb) {
      Game.find({}).stream()
        .on('data', function(item) {
          sitemap.add({
            url: item.url,
            priority: 0.6
          });
        }).on('error', cb).on('close', cb);
    }

  }, function(err) {
    if (err) return next(err);
    sitemap.toXML(function(err, xml) {
      if (err) return res.status(500).end();
      res.header('Content-Type', 'application/xml');
      res.send(xml);
    });
  });
});

module.exports = router;
