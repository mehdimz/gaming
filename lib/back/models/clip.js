'use strict';
var fs = require('fs-extra');
var mongoose = require('../db');
var lwip = require('lwip');
var async = require('async');
var ffmpeg = require('fluent-ffmpeg');
var moment = require('moment');

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
  isTrailer: Boolean,
  inBanner: Boolean
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
  fs.copy(file.path, __dirname + '/../../storage/data/720/' + _this._id + '.mp4', function(err) {
    if (err) throw err;

    var command = ffmpeg(file.path)
      .videoCodec('libx264')
      .audioCodec('libmp3lame');

    async.eachSeries([480, 360], function(item, callback) {
      command.clone()
        .size(item + 'x?')
        .save(__dirname + '/../../storage/data/' + item + '/' + _this._id + '.mp4')
        .on('error', function(err) {
          callback(err);
        })
        .on('end', function() {
          callback(null);
        });
    }, function(err) {
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
var prefix = process.env.NODE_ENV == 'production' ? 'http://cdn.bazivision.com' : '';
ClipSchema.virtual('address').get(function() {
  return {
    sm: prefix + '/data/360/' + this._id + '.mp4',
    md: prefix + '/data/480/' + this._id + '.mp4',
    lg: prefix + '/data/720/' + this._id + '.mp4'
  };
});

ClipSchema.virtual('poster').get(function() {
  return {
    sm: prefix + '/images/clips/250/' + this._id + '.jpg',
    md: prefix + '/images/clips/500/' + this._id + '.jpg',
    lg: prefix + '/images/clips/1000/' + this._id + '.jpg'
  };
});

ClipSchema.virtual('page').get(function() {
  return '/videos/' + encodeURIComponent(this.title.trim()).replace(/%20/g, '-') + '/' + this._id;
});

ClipSchema.virtual('richSnippet').get(function() {
  var snippet = {
    '@context': 'http://schema.org',
    '@type': 'VideoObject',
    'name': this.title,
    'description': this.body,
    'thumbnailUrl': this.poster.sm,
    'uploadDate': this.date,
    'duration': moment.utc(this.duration * 1000).toISOString(),
    'contentUrl': this.page,
    'interactionCount': this.viewCount
  };


  return snippet;

});



module.exports = mongoose.model('Clip', ClipSchema);
