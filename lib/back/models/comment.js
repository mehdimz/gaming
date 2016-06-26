'use strict';
var mongoose = require('../db');

var Shema = new mongoose.Schema({
  body: String,
  date: {
    type: Date,
    default: Date.now
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Comment', Shema);
