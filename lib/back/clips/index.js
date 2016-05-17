'use strict';
var router = require('express').Router();
var Clip = require('../models/clip');
var Cat = require('../models/cat');
var formidable = require('formidable');
var async = require('async');
var fs = require('fs');
var mp4duration = require("mp4duration");


router.get('/new', function(req, res, next) {
  async.parallel({
    cats: function(cb) {
      return Cat.find(cb);
    },
    clips: function(cb) {
      return Clip.find(cb);
    }
  }, function(err, data) {

    if (err) return next(err);
    res.render('clips/new', {
      items: data.clips,
      cats: data.cats
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
      fs.unlink(__dirname + '/../../storage/data/' + req.params.id + '.mp4', function(err) {
        if (err) return next(err);
        res.redirect('/clips/new');
      });
    });
  });

});

router.post('/', function(req, res, next) {
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
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

module.exports = router;
