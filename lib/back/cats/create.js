'use strict';
var Cat = require('../models/cat');
var formidable = require('formidable');


module.exports = function(req, res, next) {
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    var cat = new Cat(fields);
    cat._creator = req.user;
    cat.save(function(err) {
      if (err) return next(err);

      cat.saveImage(files.image, function(err) {
        if (err) return next(err);
        res.redirect('/cats/new');
      });

    });

  });

};
