var gulp = require('./gulp')([
  'browserify',
  'browserify-video',
  'serve',
  'watch',
  'sass',
  'minify'
]);

gulp.task('default', ['watch', 'serve']);
