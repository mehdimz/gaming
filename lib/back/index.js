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
      return Clip.find().sort('-_id').limit(8).exec(cb);
    },
    cats: function(cb) {
      return Cat.find({}, cb);
    },
    toBeReleasedGame: function(cb) {
      return Cat.findOne({
        $and: [
          { releasedate: { $ne: '' } },
          { releasedate: { $ne: '' } },
          { releasedate: { $exsits: true } }
        ]
      }, cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('index', {
      clips: data.clips,
      cats: data.cats,
      toBeReleasedGame: data.toBeReleasedGame
    });
  });
});

module.exports = router;
