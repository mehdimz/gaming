'use strict';
var mongoose = require('../db');

var CatShema = new mongoose.Schema({
  name: String,
  clips: []
});


module.exports = mongoose.model('Cat', CatShema);
