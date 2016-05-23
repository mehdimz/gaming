'use strict';

var router = require('express').Router();
var Genre = require('../models/genre');

router.get('/', function(req, res, next) {

  Genre.find({}, function(err, items) {
    if (err) return next(err);
    res.render('genres/index', {
      items: items
    });
  });

});

router.post('/', function(req, res, next) {
  var genre = new Genre({ name: req.body.name });
  genre.save(function(err) {
    if (err) return next(err);
    res.redirect('/genres');
  });
});


router.get('/:id/delete', function(req, res, next) {
  Genre.remove({ _id: req.params.id }, function(err) {
    if (err) return next(err);
    res.redirect('/genres');
  });
});


module.exports = router;
