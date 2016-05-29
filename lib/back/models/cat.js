'use strict';
var mongoose = require('../db');
var lwip = require('lwip');
var async = require('async');

var CatShema = new mongoose.Schema({
  name: { type: String, required: true },
  about: String,
  critic: String,
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
  }]
});


CatShema.methods.saveImage = function(file, cb) {
  var _this = this;
  async.eachSeries([{ w: 1000, h: 750 }, { w: 500, h: 375 }, { w: 250, h: 187 }], function iteratee(item, callback) {
    lwip.open(file.path, 'JPEG', function(err, img) {
      if (err) return callback(err);
      img.batch().resize(item.w, item.h).writeFile(__dirname + '/../../storage/images/cats/' + item.w + '/' + _this._id + '.jpg', callback);
    });
  }, cb);
};


module.exports = mongoose.model('Cat', CatShema);
