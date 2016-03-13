'use strict';
var Cat = require('../models/cat');

module.exports = function(req, res, next) {
  Cat.find(function(err, cats) {
    if (err) return next(err);
    res.render('cats/new', { cats: cats });
  });
};
