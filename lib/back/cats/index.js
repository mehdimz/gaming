'use strict';
var router = require('express').Router();
var Cat = require('../models/cat');
var Genre = require('../models/genre');
var Platform = require('../models/platform');
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
    },
    genres: function(cb) {
      return Genre.find(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('cats/new', {
      item: data.item,
      genres: data.genres,
      cats: data.cats
    });
  });
});


router.post('/:id', function(req, res, next) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    Cat.findByIdAndUpdate(req.params.id, { $set: fields }, function(err, item) {
      if (err) return next(err);
      async.series([
        function(cb) {
          if (files.image.size != 0) {
            item.saveImage(files.image, cb);
          } else {
            return cb();
          }
        },

        function(cb) {
          if (files.sliderImage.size != 0) {

            item.saveSlider(files.sliderImage, cb);
          } else {
            return cb();
          }
        },

        function(cb) {
          res.redirect('/cats/new');
          cb();
        }
      ]);


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

router.get('/:id/platforms', function(req, res, next) {
  async.parallel({
    item: function(cb) {
      Cat.findById(req.params.id, cb);
    },
    platforms: function(cb) {
      Platform.find(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('cats/platforms', {
      item: data.item,
      platforms: data.platforms
    });
  });
});

router.post('/:id/platforms', function(req, res, next) {
  Cat.findById(req.params.id, function(err, cat) {
    if (err) return next(err);
    cat._platforms = req.body.platforms;
    cat.save(function(err) {
      if (err) return next(err);
      res.redirect('/cats/' + req.params.id + '/platforms');
    });
  });
});

router.get('/:id/genres', function(req, res, next) {
  async.parallel({
    item: function(cb) {
      Cat.findById(req.params.id, cb);
    },
    genres: function(cb) {
      Genre.find(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('cats/genres', {
      item: data.item,
      genres: data.genres
    });
  });
});

router.post('/:id/genres', function(req, res, next) {
  Cat.findById(req.params.id, function(err, cat) {
    if (err) return next(err);
    cat._genres = req.body.genres;
    cat.save(function(err) {
      if (err) return next(err);
      res.redirect('/cats/' + req.params.id + '/genres');
    });
  });
});


module.exports = router;
