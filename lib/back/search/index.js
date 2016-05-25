'use strict';
var router = require('express').Router();
var async = require('async');
var Cat = require('../models/cat');
var Clip = require('../models/clip');

router.get('/', function(req, res, next) {
  var qry = req.query.query ? req.query.query : '';
  async.parallel({
    query: function(cb) {
      return cb(null, qry);
    },
    clips: function(cb) {
      return Clip.find({
        title: new RegExp('.*' + qry + '.*', 'i')
      }).populate('_tags').exec(cb);
    },
    games: function(cb) {
      return Cat.find({
        name: new RegExp('.*' + qry + '.*', 'i')
      }).exec(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('search/index', { data: data });
  });
});

module.exports = router;
