'use strict';
var router = require('express').Router();
var formidable = require('formidable');
var Image = require('../../models/image');

router.post('/', function(req, res, next) {
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {

    if (files.file.size) {
      Image.saveImage(files.file, function(err, path) {
        if (err) return next(err);
        res.json({ link: path });
      });
    }
  });

});

router.delete('/free/:id', function(req, res, next) {
  Image.unlink(req.params.id, function(err) {
    if (err) return next(err);
    res.json('done');
  });
});

module.exports = router;
