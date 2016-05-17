'use strict';
var router = require('express').Router();

router.get('/new', require('./new'));
router.post('/create', require('./create'));
router.get('/:id/delete', require('./delete'));
module.exports = router;