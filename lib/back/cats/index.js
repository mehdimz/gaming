'use strict';
var router = require('express').Router();

router.get('/new', require('./new'));
router.post('/create', require('./create'));
module.exports = router;