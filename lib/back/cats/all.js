'use strict';
var router = require('express').Router();
var Cat = require('../models/cat');
var Clip = require('../models/clip');
var Genre = require('../models/genre');
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
    clips: function(cb){
      return Clip.find({_category: req.params.id}).limit(10).exec(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('cats/show', {
      data: data
    });
  });

});

router.post('/:id/comments', require('../auth/authorize').isLoggedIn, function(req, res, next) {
  Cat.findOne(req.query).exec(function(err, cat) {
    if (err) return next(err);

    var cm = cat.comments.create({
      body: sanitizeHtml(req.body.comment),
      _user: req.user
    });
    cat.comments.unshift(cm);

    cat.save(function(err) {
      if (err) return next(err);
      res.redirect('/games/' + cat._id);
    });
  });
});


module.exports = router;
