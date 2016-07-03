'use strict';
var router = require('express').Router();
var Clip = require('../models/clip');

router.get('/', function(req, res, next) {
  var sort = req.query.sort || '-viewCount';
  Clip.find().sort(sort).exec(function(err, clips) {
    if (err) return next(err);
    res.json(clips);
  });
});

router.get('/show', function(req, res, next) {
  Clip
    .findOneAndUpdate(req.query, {
      $inc: {
        viewCount: 1
      }
    }, {
      new: true
    })
    .populate('comments._user', 'fullname')
    .exec(function(err, clip) {
      if (err) return next(err);

      res.json(clip);
    });
});

router.get('/search', function(req, res, next) {
  Clip
    .find({
      title: new RegExp(req.query.query, 'i')
    })
    .select('title')
    .exec(function(err, products) {
      if (err) return next(err);

      res.json(products);
    });
});

// router.post('/:id/comments', require('../auth/authorize').isLoggedIn, function(req, res, next) {
//   Clip.findOne(req.query).exec(function(err, clip) {
//     if (err) return next(err);


//     var cm = new Comment({
//       body: sanitizeHtml(req.body.comment),
//       _user: req.user
//     });

//     cm.save(function(err) {
//       if (err) return next(err);
//       clip.comments.push(cm);
//       clip.save(function(err) {
//         if (err) return next(err);
//         res.json(cm);
//       });
//     });
    
//   });
// });

// router.post('/:id/thumbs', require('../auth/authorize').isLoggedIn, function(req, res, next) {
//   Clip.findOne({
//     _id: req.params.id
//   }).exec(function(err, clip) {
//     if (err) return next(err);
//     //if users hasn't voted yet
//     if (clip.thumbs._users.indexOf(req.user._id) === -1) {
//       if (req.body.mode === '1') {
//         clip.thumbs.down += 1;
//       } else if (req.body.mode === '2') {
//         clip.thumbs.up += 1;
//       }

//       clip.thumbs._users.push(req.user);
//       clip.save(function(err, saved) {
//         if (err) return next(err);
//         res.json(saved.thumbs);
//       });

//     } else {

//       res.json({ message: 'already voted' });
//     }

//   });
// });

module.exports = router;
