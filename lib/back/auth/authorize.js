'use strict';
module.exports = {
  isLoggedIn: function(req, res, next) {
    if (req.user) return next();
    res.redirect('/');
  },
  isAdmin: function(req, res, next) {
    if (req.user && req.user.admin) return next();
    req.flash('error', 'u r not authorized');
    res.redirect('/');
  }
};
