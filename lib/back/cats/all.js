'use strict';
var router = require('express').Router();
var Cat = require('../models/cat');
var Genre = require('../models/genre');
var async = require('async');

router.get('/:id/:title', function(req, res, next) {
  async.parallel({
    item: function(cb) {
      return Cat.findById(req.params.id, cb);
    },
    genres: function(cb) {
      return Genre.find(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('cats/show', {
      item: data.item,
      genres: data.genres
    });
  });

});

module.exports = router;
