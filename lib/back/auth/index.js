'use strict';
var express = require('express');
var router = express.Router();
var passport = require('./passport');
var User = require('../models/user');

router.get('/login', function(req, res) {
  res.render('auth/login');
});

router.get('/signup', function(req, res) {
  res.render('auth/signup', {
    message: req.query.message
  });
});


router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/?error',
  failureFlash: true // allow flash messages
}));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// process the signup form
router.post('/signup', function(req, res, next) {
  passport.authenticate('local-signup', function(err, user, info) {
    if (err) return next(err);

    if (!user) {
      return res.redirect('/auth/signup?message=' + encodeURIComponent(info.message));
    }
    req.login(user, function(loginErr) {
      if (loginErr) return next(loginErr);
      return res.redirect('/');
    });
  })(req, res, next);

});

router.get('/email/:email/free', function(req, res, next) {
  User.findOne({
    email: req.params.email
  }, function(err, user) {
    if (err) return next(err);
    res.json({
      success: !user
    });
  });
});

module.exports = router;
