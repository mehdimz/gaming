'use strict';
var db = require('mongoose');
db.connect('mongodb://localhost/gaming');

module.exports = db;
