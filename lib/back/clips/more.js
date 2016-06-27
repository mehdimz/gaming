'use strict';
var Clip = require('../models/clip');
var Genre = require('../models/genre');
var async = require('async');
var Cat = require('../models/cat');
var paginateLimit = 12;

module.exports = function(req, res, next) {
  var page = req.query.page ? parseInt(req.query.page) : 0;
  async.parallel({
    genres: function(cb) {
      return Genre.find().exec(cb);
    },
    cats: function(cb) {
      return Cat.find({ inBanner: true }).limit(4).exec(cb);
    },
    clips: function(cb) {
      var query = Clip.find().skip(page * paginateLimit)
        .populate({ path: '_category', populate: { path: '_genres _platforms' } })
        .limit(paginateLimit);
      switch (req.params.type) {
        case 'most-viewed':
          query = query.sort('-viewCount');
          break;
        case 'latest':
          query = query.sort('-_id');
          break;
        case 'trailers':
          query = query.where({ isTrailer: 1 });
          break;
      }
      return query.exec(cb);
    },
    mostViewed: function(cb) {
      return Clip.find().limit(4).sort('-viewCount').exec(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.render('clips/more', {
      data: data,
      page: page
    });
  });
};
