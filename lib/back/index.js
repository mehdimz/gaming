'use strict';
var router = require('express').Router();
var async = require('async');
var Clip = require('./models/clip');
var Cat = require('./models/cat');

router.use('/auth', require('./auth'));
router.use('/clips', require('./auth/authorize').isAdmin, require('./clips'));
router.use('/cats', require('./auth/authorize').isAdmin, require('./cats'));
router.use('/api/clips', require('./clips/api'));

router.get('/', function(req, res, next) {
  async.parallel({
    clips: function(cb) {
      return Clip.find().sort('-_id').limit(8).exec(cb);
    },
    cats: function(cb) {
      return Cat.find().limit(5).exec(function(err, cats) {
        async.map(cats, function(item, callback) {
          Clip.find({ _category: item._id }, function(err, items) {
            if (err) return next(err);
            item.clips = items;
            callback(null, item);
          });
        }, cb);
      });
    }
  }, function(err, data) {
    res.render('index', {
      clips: data.clips,
      cats: data.cats
    });
  });
});

module.exports = router;
