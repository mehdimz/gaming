'use strict';
var router = require('express').Router();
var Cat = require('../models/cat');
var Genre = require('../models/genre');
var Platform = require('../models/platform');
var async = require('async');
var formidable = require('formidable');
var _ = require('lodash');
var fs = require('fs');

router.use('/:id/album', require('./album'));
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
    fields.inBanner = fields.inBanner ? true : false;
    fields.inCarousel = fields.inCarousel ? true : false;
    fields.inReview = fields.inReview ? true : false;
    fields.hidden = fields.hidden ? true : false;
    Cat.findOne({ _id: req.params.id }, function(err, item) {
      if (err) return next(err);
      for (var i in fields) item[i] = fields[i];
      item.save(function(err) {
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
    // map values of object and omit empty strings
    var properties = _.mapValues(req.body, function(item) {
      return _.filter(item, function(itm) {
        return itm != '';
      });
    });
    item.properties = properties;
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


router.get('/:id/additional', function(req, res, next) {
  Cat.findById(req.params.id, function(err, item) {
    if (err) return next(err);
    res.render('cats/additional', { item: item });
  });
});

router.post('/:id/additional', function(req, res, next) {
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    Cat.findById(req.params.id, function(err, item) {
      if (err) return next(err);
      if (files.image.size != 0) {
        item.saveAdditionalImage(files.image, function(err, imageName) {
          if (err) return next(err);
          item.additional_pictures.push(imageName);
          item.save(function(err) {

            if (err) return next(err);
            res.redirect('/cats/' + req.params.id + '/additional');
          });
        });
      }
    });
  });
});


router.get('/:id/additional/:addId/delete', function(req, res, next) {
  Cat.findById(req.params.id, function(err, category) {
    var index = category.additional_pictures.indexOf(req.params.addId);
    category.additional_pictures.splice(index, 1);

    async.eachSeries(['big', 350], function iteratee(item, callback) {
      fs.unlink(__dirname + '/../../storage/images/additional/' + item + '/' + req.params.addId + '.jpg', callback);
    }, function(err) {
      if (err) return next(err);
      category.save(function(err) {
        if (err) return next(err);
        res.redirect('/cats/' + req.params.id + '/additional');
      });
    });
  });
});


module.exports = router;
