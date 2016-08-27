'use strict';
var router = require('express').Router();
var Cat = require('../models/cat');
var Clip = require('../models/clip');
var Album = require('../models/album');
var Genre = require('../models/genre');
var New = require('../models/new');
var async = require('async');
var sanitizeHtml = require('sanitize-html');


router.get('/', function(req, res, next) {
  async.parallel({
    items: function(cb) {
      return Cat.find({
        about: { $ne: '' },
        hidden: { $ne: true }
      }).sort('-_id').limit(20).exec(cb);
    },
    populars: function(cb) {
      return Clip.find().sort({ viewCount: -1 }).limit(4).exec(cb);
    },
    popularNews: function(cb) {
      return New.find().sort({ viewCount: -1 }).limit(5).exec(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('cats/games/index', { data: data });
  });
});


router.get('/:title/:id', function(req, res, next) {
  async.parallel({
    item: function(cb) {
      return Cat.findById(req.params.id).populate('comments._user').exec(cb);
    },
    genres: function(cb) {
      return Genre.find(cb);
    },
    cats: function(cb) {
      return Cat.find({ hidden: { $ne: true } }).limit(4).exec(cb);
    },
    clips: function(cb) {
      return Clip.find({ _category: req.params.id }).limit(10).exec(cb);
    },
    popularNews: function(cb) {
      return New.find().sort({ viewCount: -1 }).limit(5).exec(cb);
    },
    album: function(cb) {
      return Album.findOne({ _cat: req.params.id }).exec(cb);
    },
    otherVersions: function(cb) {
      Cat.findById(req.params.id, function(err, cat) {
        if (!cat) return cb(null, null);
        Cat.find({
          _id: { $ne: req.params.id },
          name: new RegExp('.*' + cat.name + '.*', 'i')
        }).limit(10).exec(cb);
      });
    }
  }, function(err, data) {
    if (err) return next(err);
    if (!data.item) return next();
    res.render('cats/show', {
      data: data
    });
  });

});

router.get('/:title/:id/review', function(req, res, next) {
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

// router.get('/:id/:title/soundtracks', require('./soundtracks'));

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
