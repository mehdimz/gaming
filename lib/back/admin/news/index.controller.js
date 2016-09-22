'use strict';

var NewsModel = require('../../models/new');
var Cat = require('../../models/cat');
var async = require('async');

module.exports = function(req, res, next) {
  async.parallel({
    item: function(cb) {
      if (req.params.id) {
        return NewsModel.findOne({ _id: req.params.id }).exec(cb);
      } else {
        var item = new NewsModel(cb);
        cb(null, item);
      }
    },
    items: function(cb) {
      return NewsModel.find().exec(cb);
    },
    cats: function(cb) {
      return Cat.find(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('admin/news/index', {
      data: data
    });
  });

};
