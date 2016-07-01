'use strict';
var router = require('express').Router();
var async = require('async');
var Clip = require('./models/clip');
var Cat = require('./models/cat');
var New = require('./models/new');
var moment = require('moment');

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

router.get('/', function(req, res, next) {
  async.parallel({
    mostViewed: function(cb) {
      return Clip.find().sort({ viewCount: -1 }).limit(10).exec(cb);
    },
    todayClips: function(cb) {
      var today = moment().startOf('day');
      var tomorrow = moment(today).add(1, 'days');
      return Clip.find().where({
        date: {
          $gte: today.toDate(),
          $lt: tomorrow.toDate()
        }
      }).limit(10).exec(cb);
    },
    bannerGames: function(cb) {
      return Cat.find({ inBanner: true }).limit(4).exec(cb);
    },
    cats: function(cb) {
      return Cat.find().limit(10).exec(cb);
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
    },
    news: function(cb) {
      return New.find().limit(3).exec(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('index', { data: data });
  });
});

module.exports = router;
