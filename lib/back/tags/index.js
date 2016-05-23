'use strict';
var router = require('express').Router();
var Tag = require('../models/tag');

router.get('/', function(req, res, next) {
  Tag.find({}).exec(function(err, tags) {
    if (err) return next(err);
    res.render('tags/index', { items: tags });
  });
});

router.post('/', function(req, res, next) {
  var tag = new Tag({ name: req.body.name });
  tag.save(function(err) {
    if (err) return next(err);
    res.redirect('/tags');
  });
});


router.get('/:id/delete', function(req, res, next) {
  Tag.remove({ _id: req.params.id }, function(err) {
    if (err) return next(err);
    res.redirect('/tags');
  });
});

module.exports = router;
