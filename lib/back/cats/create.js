'use strict';
var Cat = require('../models/cat');

module.exports = function(req, res, next) {
  var cat = new Cat(req.body);
  cat.save(function(err) {
    if (err) return next(err);
    res.redirect('/cats/new');
  });
};
