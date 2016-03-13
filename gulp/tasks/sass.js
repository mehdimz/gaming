'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
 
module.exports = function () {
  return gulp.src('./lib/front/style/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/stylesheets/'));
};
