'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');

module.exports = function() {
  return gulp.src('public/build/bundle.js')
    .pipe(uglify())
    .pipe(gulp.dest('public/build'));
};
