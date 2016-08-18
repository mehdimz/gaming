'use strict';
var router = require('express').Router();
var Clip = require('../models/clip');
var Genre = require('../models/genre');
var sanitizeHtml = require('sanitize-html');
var async = require('async');
var Cat = require('../models/cat');
var Comment = require('../models/comment');


router.get('/more/:type', require('./more'));

router.get('/:title/:id', function(req, res, next) {
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



router.post('/:id/comments', require('../auth/authorize').isLoggedIn, function(req, res, next) {
  Clip.findOne({ _id: req.params.id }).exec(function(err, clip) {
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


router.post('/:id/thumbs', require('../auth/authorize').isLoggedIn, function(req, res, next) {
  Clip.findOne({
    _id: req.params.id
  }).exec(function(err, clip) {
    if (err) return next(err);
    //if users hasn't voted yet
    if (clip.thumbs._users.indexOf(req.user._id) === -1) {
      if (req.body.mode === '1') {
        clip.thumbs.down += 1;
      } else if (req.body.mode === '2') {
        clip.thumbs.up += 1;
      }

      clip.thumbs._users.push(req.user);
      clip.save(function(err, saved) {
        if (err) return next(err);
        res.json(saved.thumbs);
      });

    } else {

      res.json({ message: 'already voted' });
    }

  });
});

module.exports = router;
