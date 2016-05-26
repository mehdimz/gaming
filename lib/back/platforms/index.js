'use strict';

var router = require('express').Router();
var Platform = require('../models/platform');

router.get('/', function(req, res, next) {

  Platform.find({}, function(err, items) {
    if (err) return next(err);
    res.render('platforms/index', {
      items: items
    });
  });

});

router.post('/', function(req, res, next) {
  var platform = new Platform({ name: req.body.name });
  platform.save(function(err) {
    if (err) return next(err);
    res.redirect('/platforms');
  });
});


router.get('/:id/delete', function(req, res, next) {
  Platform.remove({ _id: req.params.id }, function(err) {
    if (err) return next(err);
    res.redirect('/platforms');
  });
});


module.exports = router;
