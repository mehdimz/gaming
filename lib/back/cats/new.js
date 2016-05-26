'use strict';
var Cat = require('../models/cat');
var Genre = require('../models/genre');
var async = require('async');

module.exports = function(req, res, next) {
  async.parallel({
    cats: function(cb) {
      return Cat.find(cb);
    },
    genres: function(cb) {
      return Genre.find(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('cats/new', {
      cats: data.cats,
      genres: data.genres
    });
  });
};
