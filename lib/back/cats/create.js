'use strict';
var Cat = require('../models/cat');
var formidable = require('formidable');
var async = require('async');


module.exports = function(req, res, next) {
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    fields.inBanner = fields.inBanner ? true : false;
    fields.inCarousel = fields.inCarousel ? true : false;
    var cat = new Cat(fields);
    cat._creator = req.user;

    cat.save(function(err) {
      if (err) return next(err);

      async.series([
        function(cb) {
          if (files.image.size != 0) {
            cat.saveImage(files.image, cb);
          } else {
            return cb();
          }
        },

        function(cb) {
          if (files.sliderImage.size != 0) {
            cat.saveSlider(files.sliderImage, cb);
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

};
