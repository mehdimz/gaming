'use strict';
var router = require('express').Router();
var Clip = require('../models/clip');
var Genre = require('../models/genre');
var sanitizeHtml = require('sanitize-html');
var async = require('async');

router.get('/:id', function(req, res, next) {
  async.parallel({
    item: function(cb) {
      return Clip.findOne({ _id: req.params.id })
        .populate('_category _creator _tags')
        .populate('comments._user')
        .exec(function(err, item) {
          return Genre.populate(item, { path: '_category._genres', select: 'name' }, cb);
        });
    },
    genres: function(cb) {
      Genre.find(cb);
    },
    populars: function(cb) {
      Clip.find().sort({ viewCount: -1 }).limit(4).exec(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    data.item.update({ $inc: { viewCount: 1 } }, function(err) {
      if (err) return next(err);
      res.render('clips/show', {
        item: data.item,
        genres: data.genres,
        populars: data.populars
      });
    });
  });
});

router.post('/:id/comments', require('../auth/authorize').isLoggedIn, function(req, res, next) {
  Clip.findOne(req.query).exec(function(err, clip) {
    if (err) return next(err);

    var cm = clip.comments.create({
      body: sanitizeHtml(req.body.comment),
      _user: req.user
    });
    clip.comments.unshift(cm);
    clip.save(function(err) {
      if (err) return next(err);
      res.redirect('/videos/' + clip._id);
    });
  });
});


module.exports = router;
