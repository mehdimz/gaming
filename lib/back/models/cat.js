'use strict';
var mongoose = require('../db');
var lwip = require('lwip');
var async = require('async');
var shortid = require('shortid');
var sanitizeHtml = require('sanitize-html');
var sanitizeProperties = require('../setting').sanitizeProperties;

var CatShema = new mongoose.Schema({
  name: { type: String, required: true },
  subtitle: String,
  about: String,
  critic: String,
  criticGist: String,
  releasedate: String,
  score: Number,
  inBanner: Boolean,
  inCarousel: Boolean,
  inReview: Boolean,
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  _genres: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre'
  }],
  _platforms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Platform'
  }],
  properties: {
    pros: [],
    cons: []
  },
  clips: [],
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
  additional_pictures: [String],
  viewCount: {
    type: Number,
    default: 0
  }
});


CatShema.methods.saveImage = function(file, cb) {
  var _this = this;
  async.eachSeries([{ w: 500, h: 375 }, { w: 250, h: 187 }], function iteratee(item, callback) {
    lwip.open(file.path, 'JPEG', function(err, img) {
      if (err) return callback(err);
      img.batch().cover(item.w, item.h).writeFile(__dirname + '/../../storage/images/cats/' + item.w + '/' + _this._id + '.jpg', 'jpg', { quality: 60 }, callback);
    });
  }, cb);
};


CatShema.methods.saveSlider = function(file, cb) {
  var _this = this;
  async.eachSeries([{ w: 1400, h: 600 }], function iteratee(item, callback) {
    lwip.open(file.path, 'JPEG', function(err, img) {
      if (err) return callback(err);
      img.batch().cover(item.w, item.h).writeFile(__dirname + '/../../storage/images/sliders/' + item.w + '/' + _this._id + '.jpg', 'jpg', { quality: 60 }, callback);
    });
  }, cb);
};


CatShema.methods.saveAdditionalImage = function(file, cb) {
  var imageName = shortid.generate();
  async.eachSeries([{ w: 'big' }, { w: 350, h: 260 }], function iteratee(item, callback) {
    lwip.open(file.path, 'JPEG', function(err, img) {
      if (err) return callback(err);
      if (typeof item.w == 'string') {
        img.writeFile(__dirname + '/../../storage/images/additional/' + item.w + '/' + imageName + '.jpg', 'jpg', { quality: 60 }, callback);
      } else {
        img.batch().cover(item.w, item.h).writeFile(__dirname + '/../../storage/images/additional/' + item.w + '/' + imageName + '.jpg', 'jpg', { quality: 80 }, callback);
      }
    });
  }, function(err) {
    cb(err, imageName);
  });
};


CatShema.pre('save', function(next) {
  this.about = sanitizeHtml(this.about);
  this.critic = sanitizeHtml(this.critic, sanitizeProperties);
  this.criticGist = sanitizeHtml(this.critic, { allowedTags: [] }).substring(0, 200);
  next();
});

CatShema.virtual('url').get(function() {
  var name = (this.name + ' ' + this.subtitle).trim();
  return '/games/' + this._id + '/' + encodeURIComponent(name).replace(/%20/g, '-');
});

var prefix = process.env.NODE_ENV == 'production' ? 'http://cdn.bazivision.com' : '';
CatShema.virtual('poster').get(function() {
  return {
    'sm': prefix + '/images/cats/250/' + this._id + '.jpg',
    'md': prefix + '/images/cats/500/' + this._id + '.jpg',
    'lg': prefix + '/images/sliders/1400/' + this._id + '.jpg'
  };
});

CatShema.virtual('fullname').get(function(){
  return this.name + ' ' + this.subtitle;
});

module.exports = mongoose.model('Cat', CatShema);
