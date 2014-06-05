var gulp        = require('gulp');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var imagemin    = require('gulp-imagemin');
var stylus      = require('gulp-stylus');
var minifycss   = require('gulp-minify-css');
var browserSync = require('browser-sync');
var server      = require('./app');
var notify      = require('gulp-notify');
var node;

gulp.task('styles', function() {
    gulp.src('./assets/css/*.styl')
        .pipe(stylus())
        .pipe(concat('main.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('./build/css'));
});

gulp.task('images', function() {
  return gulp.src('./assets/images/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('./build/imgs'))
});

gulp.task('scripts', function() {
    gulp.src(['./assets/javascript/app.js', './assets/javascript/*.js'])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'))
});

gulp.task('default', ['build', 'server']);
gulp.task('build', ['scripts', 'styles', 'images']);

gulp.task('server', function() {
  if(server.server) server.server.kill();
  node = server;
  node.build();
});

gulp.task('watch', ['build'], function() {
  gulp.watch(['./assets/javascript/*.js'], ['scripts']);
  gulp.watch(['./assets/css/*.styl'], ['styles']);
});

gulp.task('sync', ['watch'], function() {
  browserSync.init(['./build/js/*.js', './build/css/*.css'], {
    proxy: 'localhost:2000'
  });
});

process.on('exit', function() {
  console.log('called');
  var server = require('./app');
  if(server) server.server.kill();
});