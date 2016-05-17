var Cat = require('../models/cat');
module.exports = function(req, res, next) {
  Cat.remove({ _id: req.params.id }, function(err) {
    if (err) return next(err);
    res.redirect('/cats/new');
  });
};
