'use strict';
var router = require('express').Router();
var Clip = require('../models/clip');
var Genre = require('../models/genre');
var sanitizeHtml = require('sanitize-html');
var async = require('async');
var Cat = require('../models/cat');
var Comment = require('../models/comment');

router.get('/:id', function(req, res, next) {
  async.parallel({
    item: function(cb) {
      return Clip.findOne({ _id: req.params.id })
        .populate('_category _creator _tags comments')
        .populate('comments._user')
        .exec(function(err, item) {
          return Genre.populate(item, { path: '_category._genres', select: 'name' }, cb);
        });
    },
    genres: function(cb) {
      return Genre.find(cb);
    },
    populars: function(cb) {
      return Clip.find().sort({ viewCount: -1 }).limit(4).exec(cb);
    },
    games: function(cb) {
      return Cat.find().limit(4).exec(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    data.item.update({ $inc: { viewCount: 1 } }, function(err) {
      if (err) return next(err);
      res.render('clips/show', {
        item: data.item,
        genres: data.genres,
        populars: data.populars,
        games: data.games
      });
    });
  });
});


router.get('/more/:type', function(req, res, next) {

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
    },
    clips: function(cb) {
      return Clip.find().populate({ path: '_category', populate: { path: '_genres _platforms' } }).limit(20).exec(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('clips/more', {
      data: data
    });
  });
});

router.post('/:id/comments', require('../auth/authorize').isLoggedIn, function(req, res, next) {
  Clip.findOne({_id: req.params.id}).exec(function(err, clip) {
    if (err) return next(err);

    var cm = new Comment({
      body: sanitizeHtml(req.body.comment),
      _user: req.user
    });

    cm.save(function(err) {
      if (err) return next(err);
      clip.comments.unshift(cm._id);
      clip.save(function(err) {
        if (err) return next(err);
        res.redirect('/videos/' + clip._id);
      });
    });
  });
});


module.exports = router;
