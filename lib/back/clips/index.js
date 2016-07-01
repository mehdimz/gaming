'use strict';
var router = require('express').Router();
var Clip = require('../models/clip');
var Cat = require('../models/cat');
var Tag = require('../models/tag');
var Genre = require('../models/genre');
var formidable = require('formidable');
var async = require('async');
var fs = require('fs');
var mp4duration = require('mp4duration');


router.get('/new', function(req, res, next) {
  async.parallel({
    cats: function(cb) {
      return Cat.find(cb);
    },
    clips: function(cb) {
      return Clip.find().populate('_category').exec(cb);
    },
    genres: function(cb) {
      return Genre.find(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('clips/new', {
      items: data.clips,
      cats: data.cats,
      genres: data.genres
    });
  });
});


router.get('/delete/:id', function(req, res, next) {

  Clip.remove({
    _id: req.params.id
  }, function(err) {
    if (err) return next(err);
    async.eachSeries([800, 400, 200, 150, 100], function(size, cb) {
      fs.unlink(__dirname + '/../../storage/images/' + size + '/' + req.params.id + '.jpg', cb);
    }, function() {
      async.eachSeries([720, 480, 360], function(item, callback) {
        fs.unlink(__dirname + '/../../storage/data/' + item + '/' + req.params.id + '.mp4', callback);
      }, function(err) {
        if (err) return next(err);
        res.redirect('/clips/new');
      });
    });
  });

});

router.post('/', function(req, res, next) {
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    fields.isTrailer = fields.isTrailer == 'on' ? true : false;
    if (fields._category == '') {
      delete fields._category;
    }
    var clip = new Clip(fields);
    clip.size = files.clip.size;
    mp4duration.parse(files.clip.path, function(err, duration) {
      clip.duration = duration;
      clip._creator = req.user;
      clip.save(function(err) {
        if (err) return next(err);
        clip.saveClip(files.clip, function(err, clip) {
          if (err) return next(err);

          clip.saveImage(files.image, function(err) {
            if (err) return next(err);
            res.redirect('/clips/new');
          });

        });
      });
    });
  });

});

router.get('/:id/edit', function(req, res, next) {
  async.parallel({
    item: function(cb) {
      Clip.findById(req.params.id, cb);
    },
    cats: function(cb) {
      Cat.find(cb);
    },
    genres: function(cb) {
      Genre.find(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('clips/edit', {
      item: data.item,
      cats: data.cats,
      genres: data.genres
    });
  });
});

router.post('/:id', function(req, res, next) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    fields.isTrailer = fields.isTrailer == 'on' ? true : false;
    if (fields._category == '') {
      delete fields._category;
    }
    Clip.findByIdAndUpdate(req.params.id, { $set: fields }, function(err, clip) {
      if (err) return next(err);
      if (files.image.size) {
        clip.saveImage(files.image, function(err) {
          if (err) return next(err);
          return res.redirect('/clips/new');
        });
      } else {
        res.redirect('/clips/new');
      }

    });
  });
});


router.get('/:id/tags', function(req, res, next) {
  async.parallel({
    item: function(cb) {
      Clip.findById(req.params.id, cb);
    },
    tags: function(cb) {
      Tag.find(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('clips/tags', {
      item: data.item,
      tags: data.tags
    });
  });
});

router.post('/:id/tags', function(req, res, next) {
  Clip.findById(req.params.id, function(err, clip) {
    if (err) return next(err);
    clip._tags = req.body.tags;
    clip.save(function(err) {
      if (err) return next(err);
      res.redirect('/clips/' + req.params.id + '/tags');
    });
  });
});

module.exports = router;
