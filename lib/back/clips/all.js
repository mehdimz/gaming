'use strict';
var router = require('express').Router();
var Clip = require('../models/clip');
var sanitizeHtml = require('sanitize-html');

router.get('/:id', function(req, res, next){
  Clip.findOne(req.params.id).populate('_category _creator').populate('comments._user').exec(function(err, item){
    if (err) return next(err);
    res.render('clips/show',{item: item});
  });
});

router.post('/:id/comments', require('../auth/authorize').isLoggedIn, function(req, res, next) {
  Clip.findOne(req.query).exec(function(err, clip) {
    if (err) return next(err);

    var cm = clip.comments.create({
      body: sanitizeHtml(req.body.comment),
      _user: req.user
    });
    clip.comments.unshift(cm);
    clip.save(function(err) {
      if (err) return next(err);
      res.redirect('/videos/'+ clip._id);
    });
  });
});


module.exports = router;
