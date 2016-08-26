'use strict';

var router = require('express').Router();
var Genre = require('../models/genre');
var Cat = require('../models/cat');
var async = require('async');


router.get('/:id/:name?', function(req, res, next) {
  async.parallel({
    genres: function(cb) {
      return Genre.find().exec(cb);
    },
    item: function(cb){
      return Genre.findOne({_id: req.params.id}).exec(cb);
    },
    cats: function(cb) {
      var q = Cat.find({hidden: { $ne: true }});
      if (req.params.id) {
        q = q.where({ _genres: req.params.id });
      }
      return q.populate('_genres _platforms').limit(20).exec(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('genres/view', {
      data: data,
      currentGenre: data.item.name
    });
  });

});

module.exports = router;
