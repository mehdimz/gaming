'use strict';
var router = require('express').Router();
var async = require('async');
var New = require('../models/new');

router.get('/', function(req, res, next) {
  async.parallel({
    items: function(cb) {
      return New.find({}).limit(20).exec(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('news/list', {
      data: data
    });
  });
});

router.get('/:id/:title?', function(req, res, next) {
  async.parallel({
    item: function(cb) {
      return New.findOne({ _id: req.params.id }).exec(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('news/blog', {
      data: data
    });
  });
});

module.exports = router;
