'use strict';
var mongoose = require('../db');
var lwip = require('lwip');
var async = require('async');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');

var Schema = new mongoose.Schema({
  composer: { type: String, required: true },
  publisher: String,
  year: String,
  info: String,
  _cat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cat'
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now
  },
  viewCount: {
    type: Number,
    default: 0
  },
  thumbs: {
    up: {
      type: Number,
      default: 0
    },
    _users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }
});


Schema.methods.saveImage = function(file, cb) {
  var _this = this;
  async.eachSeries([{ w: 120, h: 120 }], function iteratee(item, callback) {
    lwip.open(file.path, 'JPEG', function(err, img) {
      if (err) return callback(err);
      img
        .batch()
        .cover(item.w, item.h)
        .writeFile(
          __dirname + '/../../storage/images/albums/' + item.w + '/' + _this._id + '.jpg',
          'jpg', {
            quality: 60
          },
          callback);
    });
  }, cb);
};

Schema.pre('save', function(next) {
  ['composer', 'publisher', 'year', 'info'].forEach(function(key) {
    this[key] = sanitizeHtml(this[key], { allowedTags: [] });
  }, this);
  next();
});

Schema.post('remove', function(doc, next) {
  async.eachSeries([120], function(size, cb) {
    fs.unlink(__dirname + '/../../storage/images/albums/' + size + '/' + doc._id + '.jpg', cb);
  }, next);
});

Schema.virtual('poster').get(function() {
  return {
    'sm': '/images/albums/120/' + this._id + '.jpg'
  };
});

module.exports = mongoose.model('Album', Schema);
