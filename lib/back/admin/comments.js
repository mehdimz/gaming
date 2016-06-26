'use strict';

var router = require('express').Router();
var Comment = require('../models/comment');

router.get('/', function(req, res, next) {
  Comment.find().populate('_user').exec(function(err, comments) {
    if (err) return next(err);
    res.render('admin/comments', {
      comments: comments
    });
  });
});

router.get('/:id/delete', function(req, res, next) {
  Comment.remove({ _id: req.params.id }).exec(function(err) {
    if (err) return next(err);
    res.redirect('/admin/comments');
  });
});

module.exports = router;
