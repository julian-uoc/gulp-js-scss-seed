var gulp = require('gulp');
var util = require('gulp-util');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');

APP_NAME = 'app';
APP_PATH = 'js/' + APP_NAME;
APP_SRC = 'src';
APP_DEST = 'dist';
IMG_SRC = 'img';

var config = {
  proxy: 'http://localhost/' + APP_DEST, // Web server route
  production: !!util.env.production
};

/* Copies all html files */
gulp.task('html', function() {
  return gulp.src(APP_SRC + '/**/*.html')
    .pipe(gulp.dest(APP_DEST));
});

/* Generates one single minified css file */
gulp.task('styles', function () {
  var sass = require('gulp-sass');
  var minify = require('gulp-clean-css');

  return gulp.src(APP_SRC + '/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(minify({compatibility: 'ie8'}))
    .pipe(concat('style.css'))
    .pipe(gulp.dest(APP_DEST + '/css/'));
});

/* Optimizes and copies png files*/
gulp.task('images', function() {
  var imagemin = require('gulp-imagemin');
  var pngquant = require('imagemin-pngquant');

  return gulp.src(IMG_SRC + '/*.png')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(APP_DEST + '/img'));
});

/* Prepare Browser-sync for localhost */
gulp.task('browser-sync', function() {
  browserSync.init({ proxy: config.proxy });
});

/*
  Do tasks depending on src folder changes, reloads on any
  destination folder change.
*/
gulp.task('watch', [], function() {
  gulp.watch(APP_SRC + '/**/*.js', ['scripts']);
  gulp.watch(APP_SRC + '/**/*.scss', ['styles']);
  gulp.watch(APP_SRC + '/**/*.html', ['html']);
  gulp.watch(APP_DEST + '/**/*', browserSync.reload);
});

/* Executes js linter */
gulp.task('lint', function() {
  var jshint = require('gulp-jshint');

  return gulp.src(APP_SRC + '/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

/* Deletes the destination folder */
gulp.task('clean', function() {
  var clean = require('gulp-clean');

  return gulp.src(APP_DEST, {read:false})
    .pipe(clean());
});

/* Script generation */
gulp.task('scripts', ['lint'], function() {
  var uglify = require('gulp-uglify');

  return gulp.src(APP_SRC + '/**/*.js')
    .pipe(concat(APP_NAME + '.js'))
    .pipe(!!config.production ? uglify() : util.noop())
    .pipe(gulp.dest(APP_DEST + '/js'));
});


/* Runs the tasks in sequence to build the web */
gulp.task('default', function() {
  var runSequence = require('run-sequence');

  runSequence(
    'clean',
    ['styles', 'html', 'scripts', 'images'],
    'watch',
    'browser-sync');
});

