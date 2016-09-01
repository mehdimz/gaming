'use strict';
var router = require('express').Router();
var Clip = require('../models/clip');
var Genre = require('../models/genre');
var Platform = require('../models/platform');
var sanitizeHtml = require('sanitize-html');
var async = require('async');
var Cat = require('../models/cat');
var New = require('../models/new');
var Comment = require('../models/comment');


router.get('/more/:type', require('./more'));

router.get('/', function(req, res, next) {
  async.parallel({
    items: function(cb) {
      return Clip.find().sort('-_id').limit(20).exec(cb);
    },
    populars: function(cb) {
      return Clip.find().sort({ viewCount: -1 }).limit(4).exec(cb);
    },
    popularNews: function(cb) {
      return New.find().sort({ viewCount: -1 }).limit(5).exec(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('clips/all/index', { data: data });
  });
});

router.get('/platform/:name', function(req, res, next) {
  async.autoInject({
    platform: function(cb) {
      return Platform.findOne({ name: req.params.name }).exec(function(err, item) {
        if (err) return cb(cb);
        if (!item) return next();
        return cb(null, item);
      });
    },
    cats: function(platform, cb) {
      return Cat.find({ '_platforms': platform._id }).exec(cb);
    },
    items: function(cats, cb) {
      return Clip.find({ '_category': { $in: cats } }).sort('-_id').exec(cb);
    },
    populars: function(cb) {
      return Clip.find().sort({ viewCount: -1 }).limit(4).exec(cb);
    },
    popularNews: function(cb) {
      return New.find().sort({ viewCount: -1 }).limit(5).exec(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('clips/all/index', { data: data });
  });
});

router.get('/genre/:name', function(req, res, next) {
  async.autoInject({
    genre: function(cb) {
      return Genre.findOne({ name: req.params.name }).exec(function(err, item) {
        if (err) return cb(cb);
        if (!item) return next();
        return cb(null, item);
      });
    },
    cats: function(genre, cb) {
      return Cat.find({ '_genres': genre._id }).exec(cb);
    },
    items: function(cats, cb) {
      return Clip.find({ '_category': { $in: cats } }).sort('-_id').exec(cb);
    },
    populars: function(cb) {
      return Clip.find().sort({ viewCount: -1 }).limit(4).exec(cb);
    },
    popularNews: function(cb) {
      return New.find().sort({ viewCount: -1 }).limit(5).exec(cb);
    }
  }, function(err, data) {
    if (err) return next(err);

    res.render('clips/all/index', { data: data });
  });
});

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
      return Cat.find({ hidden: { $ne: true } }).limit(4).exec(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    if (!data.item) return next();
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
        res.redirect(clip.page);
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
