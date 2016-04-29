var gulp = require('gulp');
var gls = require('gulp-live-server');

module.exports = function() {
  var server = gls.new('./bin/www');
  server.start();

  gulp.watch(['lib/front/**/*.js','public/stylesheets/**/*.css', 'views/**/*.jade'], function(file) {
    server.notify.apply(server, [file]);
  });

  gulp.watch(['app.js', './lib/back/**/*.js'], function() {
    server.start.bind(server)();
  });
};
