'use strict';
var router = require('express').Router();

router.use('/comments', require('./comments'));
router.use('/news', require('./news'));
router.use('/images', require('./images'));

module.exports = router;
