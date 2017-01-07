var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('test', () => {
  gulp.src('./server/test.js')
    .pipe(mocha());
});
