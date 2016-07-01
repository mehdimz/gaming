'use strict';
var router = require('express').Router();
var formidable = require('formidable');
var New = require('../../models/new');

router.get('/', function(req, res, next) {
  New.find().exec(function(err, items) {
    if (err) return next(err);
    res.render('admin/news/index', {
      items: items
    });
  });
});



router.post('/', function(req, res, next) {
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    var newThing = new New(fields);
    newThing._creator = req.user;

    newThing.save(function(err) {
      if (err) return next(err);

      newThing.saveImage(files.image, function(err) {
        if (err) return next(err);
        res.redirect('/admin/news');
      });

    });

  });

});


router.get('/:id/delete', function(req, res, next) {

  New.findOne({ _id: req.params.id }, function(err, doc) {
    if (err) return next(err);
    doc.remove(function(err) {
      if (err) return next(err);
      res.redirect('/admin/news');
    });
  });
});


module.exports = router;
