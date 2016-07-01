'use strict';
var router = require('express').Router();
var New = require('../models/new');

router.get('/:id', function(req, res, next) {
  New.findOne({ _id: req.params.id }).exec(function(err, item) {
    if (err) return next(err);
    res.render('news/news-blog', {
      item: item
    });
  });
});

module.exports = router;
