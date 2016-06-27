'use strict';
var fs = require('fs');
var mongoose = require('../db');
var lwip = require('lwip');
var async = require('async');

var ClipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  date: {
    type: Date,
    default: Date.now
  },
  hidden: Boolean,
  thumbs: {
    up: {
      type: Number,
      default: 0
    },
    down: {
      type: Number,
      default: 0
    },
    _users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  viewCount: {
    type: Number,
    default: 0
  },
  size: Number,
  _category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cat'
  },
  _genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre'
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  duration: Number,
  _tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  isTrailer: Boolean
}, {
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      if (ret.thumbs) delete ret.thumbs._users;
      return ret;
    }
  }
});

ClipSchema.methods.saveClip = function(file, cb) {
  var _this = this;
  fs.readFile(file.path, function(err, data) {
    var newPath = __dirname + '/../../storage/data/' + _this._id + '.mp4';
    fs.writeFile(newPath, data, function(err) {
      return cb(err, _this);
    });
  });
};

ClipSchema.methods.saveImage = function(file, cb) {
  var _this = this;
  async.eachSeries([{ w: 1000, h: 562 }, { w: 500, h: 281 }, { w: 250, h: 140 }], function iteratee(item, callback) {
    lwip.open(file.path, 'JPEG', function(err, img) {
      if (err) return callback(err);
      img.batch().resize(item.w, item.h).writeFile(__dirname + '/../../storage/images/clips/' + item.w + '/' + _this._id + '.jpg', 'jpg', { quality: 60 }, callback);
    });
  }, cb);
};

//virtuals
ClipSchema.virtual('address').get(function() {
  return '/data/' + this._id + '.mp4';
});
ClipSchema.virtual('poster.eight').get(function() {
  return 'images/800/' + this._id + '.jpg';
});
ClipSchema.virtual('poster.four').get(function() {
  return 'images/400/' + this._id + '.jpg';
});

module.exports = mongoose.model('Clip', ClipSchema);
