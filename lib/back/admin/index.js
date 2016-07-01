'use strict';
var router = require('express').Router();

router.use('/comments', require('./comments'));
router.use('/news', require('./news'));

module.exports = router;
