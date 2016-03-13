var gulp = require('./gulp')([
  'browserify',
  'serve',
  'watch',
  'sass'
]);

gulp.task('default', ['watch', 'serve', 'browserify', 'sass']);
