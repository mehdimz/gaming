'use strict';
var moment = require('moment-jalali');
var Platform = require('./models/platform');
var Genre = require('./models/genre');
var async = require('async');

module.exports = function(req, res, next) {
  if (req.user) res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  //add date format for views
  moment.loadPersian();
  res.locals.moment = moment;
  async.parallel({
    platforms: function(cb) {
      return Platform.find(cb);
    },
    genres: function(cb) {
      return Genre.find(cb);
    }
  }, function(err, data) {
    if (err) return next(err);

    res.locals.platforms = data.platforms;
    res.locals.genres = data.genres;
    next();
  });
};
