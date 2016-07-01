'use strict';
var mongoose = require('../db');
var lwip = require('lwip');
var async = require('async');
var sanitizeHtml = require('sanitize-html');
var fs = require('fs');

var Schema = new mongoose.Schema({
  title: { type: String, required: true },
  body: String,
  gist: String,
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  _tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  comments: [{
    body: String,
    date: {
      type: Date,
      default: Date.now
    },
    _user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  date: {
    type: Date,
    default: Date.now
  }
});


Schema.methods.saveImage = function(file, cb) {
  var _this = this;
  async.eachSeries([{ w: 1000, h: 750 }, { w: 500, h: 375 }, { w: 250, h: 187 }], function iteratee(item, callback) {
    lwip.open(file.path, 'JPEG', function(err, img) {
      if (err) return callback(err);
      img
        .batch()
        .cover(item.w, item.h)
        .writeFile(
          __dirname + '/../../storage/images/news/' + item.w + '/' + _this._id + '.jpg',
          'jpg', {
            quality: 60
          },
          callback);
    });
  }, cb);
};

Schema.pre('save', function(next) {
  this.body = sanitizeHtml(this.body);
  this.title = sanitizeHtml(this.title);
  this.gist = sanitizeHtml(this.body, { allowedTags: [] }).substring(0, 500);
  next();
});

Schema.post('remove', function(doc, next) {
  async.eachSeries([1000, 500, 250], function(size, cb) {
    fs.unlink(__dirname + '/../../storage/images/news/' + size + '/' + doc._id + '.jpg', cb);
  }, next);
});

Schema.virtual('poster').get(function() {
  return {
    'small': '/images/news/250/' + this._id + '.jpg',
    'medium': '/images/news/500/' + this._id + '.jpg',
    'big': '/images/news/1000/' + this._id + '.jpg'
  };
});

Schema.virtual('page').get(function() {
  return '/news/' + this._id + '/' + encodeURIComponent(this.title).replace(/%20/g, '+');
});


module.exports = mongoose.model('New', Schema);
