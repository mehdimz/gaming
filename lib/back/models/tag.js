'use strict';
var mongoose = require('../db');

var TagShema = new mongoose.Schema({
  name: {type:String, required: true}
});

module.exports = mongoose.model('Tag', TagShema);
