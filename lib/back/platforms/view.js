'use strict';

var router = require('express').Router();
var Genre = require('../models/genre');
var Cat = require('../models/cat');
var async = require('async');

router.get('/:id/:name', function(req, res, next) {
  async.parallel({
    genres: function(cb) {
      return Genre.find().exec(cb);
    },
    cats: function(cb) {
      return Cat.find({ _genre: req.params.id, hidden: { $ne: true } }).populate('_genre').limit(4).exec(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('genres/view', {
      data: data
    });
  });

});

module.exports = router;
