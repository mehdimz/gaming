var gulp = require('gulp');

module.exports = function() {
  gulp.watch(['lib/front/**/*.js'], ['browserify']);
  gulp.watch(['lib/front/video.js'], ['browserify-video']);
  gulp.watch(['lib/front/style/**/*.scss'], ['sass']);
};
