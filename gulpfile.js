var gulp = require('./gulp')([
  'browserify',
  'serve',
  'watch',
  'sass',
  'minify'
]);

gulp.task('default', ['watch', 'serve', 'browserify', 'sass']);
