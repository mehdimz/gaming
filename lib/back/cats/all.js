'use strict';
var router = require('express').Router();
var Cat = require('../models/cat');
var Clip = require('../models/clip');
var Genre = require('../models/genre');
var New = require('../models/new');
var async = require('async');
var sanitizeHtml = require('sanitize-html');


router.get('/:id/:title?', function(req, res, next) {
  async.parallel({
    item: function(cb) {
      return Cat.findById(req.params.id).populate('comments._user').exec(cb);
    },
    genres: function(cb) {
      return Genre.find(cb);
    },
    cats: function(cb) {
      return Cat.find().limit(4).exec(cb);
    },
    clips: function(cb) {
      return Clip.find({ _category: req.params.id }).limit(10).exec(cb);
    },
    popularNews: function(cb) {
      return New.find().sort({ viewCount: -1 }).limit(5).exec(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('cats/show', {
      data: data
    });
  });

});

router.get('/:id/:title/review', function(req, res, next) {
  async.parallel({
    item: function(cb) {
      return Cat.findById(req.params.id).populate('comments._user _creator').exec(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    data.item.update({ $inc: { viewCount: 1 } }, function(err) {
      if (err) return next(err);
      res.render('cats/review', {
        data: data
      });
    });
  });
});

router.post('/:id/comments', require('../auth/authorize').isLoggedIn, function(req, res, next) {
  Cat.findOne({ _id: req.params.id }).exec(function(err, cat) {
    if (err) return next(err);

    var cm = cat.comments.create({
      body: sanitizeHtml(req.body.comment),
      _user: req.user
    });
    cat.comments.unshift(cm);

    cat.save(function(err) {
      if (err) return next(err);
      res.redirect(cat.url + '/review');
    });
  });
});


module.exports = router;
