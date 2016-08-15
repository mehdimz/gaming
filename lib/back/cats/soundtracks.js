'use strict';
var async = require('async');
var Cat = require('../models/cat');

module.exports = function(req, res, next) {
  async.parallel({
    item: function(cb) {
      return Cat.findOne({ _id: req.params.id }).exec(cb);
    },
    cats: function(cb) {
      return Cat.find().limit(4).exec(cb);
    }
  }, function(err, data) {
    if (err) next(err);
    res.render('cats/soundtracks', {
      data: data
    });
  });
};
