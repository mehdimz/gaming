'use strict';
var router = require('express').Router();
var async = require('async');
var Cat = require('../models/cat');
var Clip = require('../models/clip');
var New = require('../models/new');

router.get('/', function(req, res, next) {
  var qry = req.query.query ? req.query.query : '';
  async.parallel({
    query: function(cb) {
      return cb(null, qry);
    },
    clips: function(cb) {
      return Clip.find({
        title: new RegExp('.*' + qry + '.*', 'i')
      }).limit(12).populate('_tags').exec(cb);
    },
    games: function(cb) {
      return Cat.find({
        name: new RegExp('.*' + qry + '.*', 'i')
      }).limit(10).exec(cb);
    },
    news: function(cb) {
      return New.find({
        title: new RegExp('.*' + qry + '.*', 'i')
      }).limit(10).exec(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('search/index', { data: data });
  });
});

module.exports = router;
