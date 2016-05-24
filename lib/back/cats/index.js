'use strict';
var router = require('express').Router();
var Cat = require('../models/cat');
var async = require('async');
var formidable = require('formidable');

router.get('/new', require('./new'));
router.post('/', require('./create'));
router.get('/:id/delete', require('./delete'));

router.get('/:id/edit', function(req, res, next) {
  async.parallel({
    item: function(cb) {
      return Cat.findById(req.params.id, cb);
    },
    cats: function(cb) {
      return Cat.find(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('cats/new', {
      item: data.item,
      cats: data.cats
    });
  });
});


router.post('/:id', function(req, res, next) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    Cat.findByIdAndUpdate(req.params.id, { $set: fields }, function(err, item) {
      if (err) return next(err);
      if (files.image.length) {
        item.saveImage(files.image, function(err) {
          if (err) return next(err);
          res.redirect('/cats/new');
        });
      } else {
        res.redirect('/cats/new');
      }
    });
  });
});


router.get('/:id/properties', function(req, res, next) {
  Cat.findById(req.params.id, function(err, item) {
    if (err) return next(err);
    res.render('cats/properties', {
      item: item
    });
  });
});

router.post('/:id/properties', function(req, res, next) {
  Cat.findById(req.params.id, function(err, item) {
    if (err) return next(err);
    item.properties = req.body;
    item.save(function(err, item) {
      if (err) return next(err);
      res.render('cats/properties', {
        item: item
      });
    });
  });
});

module.exports = router;
