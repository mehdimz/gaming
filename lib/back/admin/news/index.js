'use strict';
var router = require('express').Router();
var formidable = require('formidable');
var NewsModel = require('../../models/new');



router.get('/', require('./index.controller'));
router.get('/:id/edit', require('./index.controller'));



router.post('/', function(req, res, next) {
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    NewsModel.findOne({ _id: fields._id }, function(err, newThing) {
      if (err) return next(err);
      if (newThing == null) {
        newThing = new NewsModel();
      }
      newThing.title = fields.title;
      newThing.body = fields.body;
      newThing.inBanner = !!fields.inBanner;
      newThing._creator = req.user;
      
      newThing.save(function(err) {
        if (err) return next(err);

        if (files.image.size) {

          newThing.saveImage(files.image, function(err) {
            if (err) return next(err);
            res.redirect('/admin/news');
          });
        } else {
          res.redirect('/admin/news');
        }

      });
    });


  });

});


router.get('/:id/delete', function(req, res, next) {

  NewsModel.findOne({ _id: req.params.id }, function(err, doc) {
    if (err) return next(err);
    doc.remove(function(err) {
      if (err) return next(err);
      res.redirect('/admin/news');
    });
  });
});



module.exports = router;
