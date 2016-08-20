'use strict';
var router = require('express').Router();
var async = require('async');
var New = require('../models/new');
var Genre = require('../models/genre');
var Cat = require('../models/cat');
var Clip = require('../models/clip');

router.get('/', function(req, res, next) {
  async.parallel({
    items: function(cb) {
      return New.find({}).limit(20).sort('-_id').exec(cb);
    },
    bannerGames: function(cb) {
      return Cat.find({ inBanner: true, hidden: { $ne: true } }).limit(4).exec(cb);
    },
    populars: function(cb) {
      return Clip.find().sort({ viewCount: -1 }).limit(4).exec(cb);
    },
    popularNews: function(cb) {
      return New.find().sort({ viewCount: -1 }).limit(5).exec(cb);
    },
    games: function(cb) {
      return Cat.find({ hidden: { $ne: true } }).limit(4).exec(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('news/list', {
      data: data
    });
  });
});

router.get('/:title?/:id', function(req, res, next) {
  async.parallel({
    item: function(cb) {
      return New
        .findOne({ _id: req.params.id })
        .populate('_creator')
        .exec(cb);
    },
    genres: function(cb) {
      return Genre.find().exec(cb);
    },
    games: function(cb) {
      return Cat.find().limit(4).exec(cb);
    },
    popularNews: function(cb) {
      return New.find().sort({ viewCount: -1 }).limit(5).exec(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    data.item.update({ $inc: { viewCount: 1 } }, function(err) {
      if (err) return next(err);
      res.render('news/blog', {
        data: data
      });
    });
  });
});

router.post('/:id/thumbs', require('../auth/authorize').isLoggedIn, function(req, res, next) {
  New.findOne({
    _id: req.params.id
  }).exec(function(err, item) {
    if (err) return next(err);
    //if users hasn't voted yet
    if (item.thumbs._users.indexOf(req.user._id) === -1) {
      if (req.body.mode === '1') {
        item.thumbs.down += 1;
      } else if (req.body.mode === '2') {
        item.thumbs.up += 1;
      }

      item.thumbs._users.push(req.user);
      item.save(function(err, saved) {
        if (err) return next(err);
        res.json(saved.thumbs);
      });

    } else {

      res.json({ message: 'already voted' });
    }

  });
});

module.exports = router;
