var gulp = require('gulp');
var sass = require('gulp-sass');

var paths = {
  styles: './scss/*.scss'
};

gulp.task('sass', function () {
    gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'));
});

gulp.task('watch', function  () {
  gulp.watch('./scss/*.scss', ['sass']);
})

gulp.task('watch', function  () {
  gulp.watch(paths.styles, ['sass']);
})