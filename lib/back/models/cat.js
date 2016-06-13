'use strict';
var mongoose = require('../db');
var lwip = require('lwip');
var async = require('async');
var shortid = require('shortid');

var CatShema = new mongoose.Schema({
  name: { type: String, required: true },
  subtitle: String,
  about: String,
  critic: String,
  releasedate: String,
  score: Number,
  inBanner: Boolean,
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
  additional_pictures: [String]
});


CatShema.methods.saveImage = function(file, cb) {
  var _this = this;
  async.eachSeries([{ w: 1000, h: 750 }, { w: 500, h: 375 }, { w: 250, h: 187 }], function iteratee(item, callback) {
    lwip.open(file.path, 'JPEG', function(err, img) {
      if (err) return callback(err);
      img.batch().resize(item.w, item.h).writeFile(__dirname + '/../../storage/images/cats/' + item.w + '/' + _this._id + '.jpg', 'jpg', { quality: 80 }, callback);
    });
  }, cb);
};


CatShema.methods.saveSlider = function(file, cb) {
  var _this = this;
  async.eachSeries([{ w: 1600, h: 645 }], function iteratee(item, callback) {
    lwip.open(file.path, 'JPEG', function(err, img) {
      if (err) return callback(err);
      img.batch().resize(item.w, item.h).writeFile(__dirname + '/../../storage/images/sliders/' + item.w + '/' + _this._id + '.jpg', 'jpg', { quality: 80 }, callback);
    });
  }, cb);
};


CatShema.methods.saveAdditionalImage = function(file, cb) {
  var imageName = shortid.generate();
  async.eachSeries([{ w: 1600, h: 645 }, { w: 400, h: 161 }], function iteratee(item, callback) {
    lwip.open(file.path, 'JPEG', function(err, img) {
      if (err) return callback(err);
      img.batch().resize(item.w, item.h).writeFile(__dirname + '/../../storage/images/additional/' + item.w + '/' + imageName + '.jpg', 'jpg', { quality: 80 }, callback);
    });
  }, function(err) {
    cb(err, imageName);
  });
};



module.exports = mongoose.model('Cat', CatShema);
