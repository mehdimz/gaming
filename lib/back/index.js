'use strict';
var router = require('express').Router();
var async = require('async');
var Clip = require('./models/clip');
var Cat = require('./models/cat');

router.use('/auth', require('./auth'));
router.use('/search', require('./search'));
router.use('/videos', require('./clips/all'));
router.use('/games', require('./cats/all'));
router.use('/genre/view', require('./genres/view'));
router.use('/clips', require('./auth/authorize').isAdmin, require('./clips'));
router.use('/cats', require('./auth/authorize').isAdmin, require('./cats'));
router.use('/tags', require('./auth/authorize').isAdmin, require('./tags'));
router.use('/genres', require('./auth/authorize').isAdmin, require('./genres'));
router.use('/platforms', require('./auth/authorize').isAdmin, require('./platforms'));
router.use('/api/clips', require('./clips/api'));

router.get('/', function(req, res, next) {
  async.parallel({
    clips: function(cb) {
      return Clip.find({ isTrailer: { $ne: true } }).sort('-_id').limit(8).exec(cb);
    },
    bannerGames: function(cb) {
      return Cat.find({ inBanner: true }).limit(4).exec(cb);
    },
    cats: function(cb) {
      return Cat.find().limit(20).exec(cb);
    },
    toBeReleasedGame: function(cb) {
      return Cat.findOne({
        $and: [
          { releasedate: { $ne: '' } },
          { releasedate: { $ne: null } }
        ]
      }, cb);
    },
    trailers: function(cb) {
      return Clip.find({ isTrailer: true }).populate({ path: '_category', populate: { path: '_platforms' } }).sort('-_id').limit(10).exec(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('index', {
      clips: data.clips,
      cats: data.cats,
      bannerGames: data.bannerGames,
      toBeReleasedGame: data.toBeReleasedGame,
      trailers: data.trailers
    });
  });
});

module.exports = router;
