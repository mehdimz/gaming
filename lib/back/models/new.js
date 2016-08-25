'use strict';
var mongoose = require('../db');
var lwip = require('lwip');
var async = require('async');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var sanitizeProperties = require('../setting').sanitizeProperties;

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
  async.eachSeries([{ w: 1400, h: 600 }, { w: 400, h: 290 }, { w: 100, h: 70 }], function iteratee(item, callback) {
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
  this.title = sanitizeHtml(this.title);
  this.body = sanitizeHtml(this.body, sanitizeProperties);
  this.gist = sanitizeHtml(this.body, { allowedTags: [] }).substring(0, 600);
  next();
});

Schema.post('remove', function(doc, next) {
  async.eachSeries([1000, 400], function(size, cb) {
    fs.unlink(__dirname + '/../../storage/images/news/' + size + '/' + doc._id + '.jpg', cb);
  }, next);
});

var prefix = process.env.NODE_ENV == 'production' ? 'http://cdn.bazivision.com' : '';
Schema.virtual('poster').get(function() {
  return {
    'small': prefix + '/images/news/100/' + this._id + '.jpg',
    'medium': prefix + '/images/news/400/' + this._id + '.jpg',
    'big': prefix + '/images/news/1400/' + this._id + '.jpg'
  };
});

Schema.virtual('page').get(function() {
  return '/news/' + encodeURIComponent(this.title).replace(/%20/g, '-') + '/' + this._id ;
});

module.exports = mongoose.model('New', Schema);
