'use strict';
var router = require('express').Router({ mergeParams: true });
var formidable = require('formidable');
var Album = require('../../models/album');

router.get('/', function(req, res, next) {
  Album.findOne({ _cat: req.params.id }, function(err, item) {
    if (err) return next(err);
    res.render('cats/album/index', {
      item: item
    });
  });
});

router.post('/', function(req, res, next) {
  var form = new formidable.IncomingForm();
  var redirectUrl = '/cats/' + req.params.id + '/album';

  form.parse(req, function(err, fields, files) {

    var album = new Album(fields);
    album._creator = req.user;
    album._cat = req.params.id;

    album.save(function(err) {
      if (err) return next(err);

      if (files.image.size != 0) {
        album.saveImage(files.image, function() {

          res.redirect(redirectUrl);
        });
      } else {
        res.redirect(redirectUrl);
      }
    });
  });
});

router.post('/:albumId', function(req, res, next) {
  var form = new formidable.IncomingForm();
  var redirectUrl = '/cats/' + req.params.id + '/album';
  form.parse(req, function(err, fields, files) {

    Album.findOne({ _id: req.params.albumId }, function(err, item) {
      if (err) return next(err);
      for (var i in fields) item[i] = fields[i];

      item.save(function(err) {
        if (err) return next(err);

        if (files.image.size != 0) {
          item.saveImage(files.image, function() {
            res.redirect(redirectUrl);
          });
        } else {
          res.redirect(redirectUrl);
        }

      });

    });
  });
});

module.exports = router;
