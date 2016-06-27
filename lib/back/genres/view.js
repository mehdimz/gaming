'use strict';

var router = require('express').Router();
var Genre = require('../models/genre');
var Cat = require('../models/cat');
var async = require('async');


router.get('/:id?/:name?', function(req, res, next) {
  async.parallel({
    genres: function(cb) {
      return Genre.find().exec(cb);
    },
    cats: function(cb) {
      var q = Cat.find();
      if (req.params.id) {
        q = q.where({ _genres: req.params.id });
      }
      return q.populate('_genres _platforms').limit(20).exec(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('genres/view', {
      data: data,
      currentGenre: req.params.name
    });
  });

});

module.exports = router;
