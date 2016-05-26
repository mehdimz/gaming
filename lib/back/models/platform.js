'use strict';
var mongoose = require('../db');

var Shema = new mongoose.Schema({
  name: {type:String, required: true}
});

module.exports = mongoose.model('Platform', Shema);
