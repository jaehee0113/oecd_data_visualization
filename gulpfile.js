// requirements
var gulp = require('gulp');
var browserSync = require('browser-sync');
var reactify = require('reactify');
var del = require('del');
var size = require('gulp-size');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');

// tasks

// Initiates a server that is used for development.
gulp.task('server', function() {
	browserSync.init({
		server: {
			baseDir: "./"
		}
	})
});

//Used to delete the previously generated file (from JSX) to ensure that we can start fresh and clean.
gulp.task('del', function () {
  // add task
  return gulp.src('./static/dest/css', {read: false})
  		.pipe(clean());

});

//This task changes scss into css.
gulp.task('styles', function(){
	var stream = gulp.src('./static/src/css/*.scss')
		.pipe(sass({
			style: 'compressed'
		}))
		.pipe(prefix('last 2 versions'))
		.pipe(gulp.dest('./static/dest/css/'))
		.pipe(browserSync.stream());

	return stream;
});

gulp.task('default', ['del'], function() {
	gulp.start('server');
	gulp.start('styles');
	gulp.watch('./static/src/css/*.scss', ['styles']);
	gulp.watch('./static/dest/js/*.js').on('change', browserSync.reload);
	gulp.watch('./*.html').on('change', browserSync.reload);
});

