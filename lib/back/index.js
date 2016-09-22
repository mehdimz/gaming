'use strict';
var router = require('express').Router();
var async = require('async');
var Clip = require('./models/clip');
var Cat = require('./models/cat');
var New = require('./models/new');

router.use('/auth', require('./auth'));
router.use('/search', require('./search'));
router.use('/videos', require('./clips/all'));
router.use('/games', require('./cats/all'));
router.use('/news', require('./news'));
router.use('/genre/view', require('./genres/view'));
router.use('/clips', require('./auth/authorize').isAdmin, require('./clips'));
router.use('/cats', require('./auth/authorize').isAdmin, require('./cats'));
router.use('/tags', require('./auth/authorize').isAdmin, require('./tags'));
router.use('/genres', require('./auth/authorize').isAdmin, require('./genres'));
router.use('/platforms', require('./auth/authorize').isAdmin, require('./platforms'));
router.use('/admin', require('./auth/authorize').isAdmin, require('./admin'));
router.use('/api/clips', require('./clips/api'));
router.use(require('./sitemap'));

router.get('/', function(req, res, next) {
  async.parallel({
    mostViewed: function(cb) {
      return Clip.find().sort({ viewCount: -1 }).limit(8).exec(cb);
    },
    todayClips: function(cb) {
      return Clip.find({isTrailer: false}).limit(8).sort('-_id').exec(cb);
    },
    bannerClip: function(cb) {
      return Clip.findOne({ inBanner: true }).exec(cb);
    },
    bannerGames: function(cb) {
      return Cat.find({
        inBanner: true,
        hidden: { $ne: true }
      }).limit(3).exec(cb);
    },
    cats: function(cb) {
      return Cat.find({
        inCarousel: true,
        hidden: { $ne: true }
      }).limit(8).exec(cb);
    },
    naghds: function(cb) {
      return Cat.find({
        inReview: true,
        $and: [
          { criticGist: { $ne: '' } },
          { criticGist: { $ne: null } }
        ],
        hidden: { $ne: true }
      }).limit(6).exec(cb);
    },
    toBeReleasedGame: function(cb) {
      return Cat.findOne({
        $and: [
          { releasedate: { $ne: '' } },
          { releasedate: { $ne: null } }
        ],
        hidden: { $ne: true }
      }, cb);
    },
    trailers: function(cb) {
      return Clip.find({ isTrailer: true }).populate({ path: '_category', populate: { path: '_platforms' } }).sort('-_id').limit(8).exec(cb);
    },
    news: function(cb) {
      return New.find().sort('-_id').limit(7).exec(cb);
    },
    bannerNews: function(cb) {
      return New.find({ inBannerSmall: true }).limit(7).exec(cb);
    },
    bannerNew: function(cb) {
      return New.findOne({ inBanner: true }).exec(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('index', { data: data });
  });
});

module.exports = router;
