
var gulp         = require('gulp'),
    gutil        = require('gulp-util'),
    server       = require('gulp-server-livereload'),
    sass         = require('gulp-sass'),
    autoprefixer = require('autoprefixer-core');
    postcss      = require('gulp-postcss'),
    minifycss    = require('gulp-minify-css'),
    jshint       = require('gulp-jshint'),
    uglify       = require('gulp-uglify'),
    imagemin     = require('gulp-imagemin'),
    rename       = require('gulp-rename'),
    concat       = require('gulp-concat'),
    notify       = require('gulp-notify'),
    cache        = require('gulp-cache'),
    livereload   = require('gulp-livereload'),
    del          = require('del'),
    browserSync   = require('browser-sync');;

gulp.task('styles', function() {
  return gulp.src('app/styles/main.scss')
    .pipe(sass({ style: 'expanded' }))
    .pipe(postcss([autoprefixer({ browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']})]))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('templates', function() {
  return gulp.src('app/*.html')
    .pipe(gulp.dest('dist/'));
});

gulp.task('scripts', function() {
  return gulp.src('app/scripts/**/*.js')
    // .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/assets/img'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./app"
    },
    port: 1337
  });
});

gulp.task('clean', function(cb) {
  del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img'], cb)
});

gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'scripts', 'images');
});

gulp.task('reload-templates', ['templates'], function(){
  browserSync.reload();
});

gulp.task('watch', function() {
  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('app/images/**/*', ['images']);
  gulp.watch('app/*.html', ['reload-templates']);
  gutil.log(gutil.colors.bgGreen('Watching for changes...'));
});

// gulp.task('webserver', function() {
//   gulp.src('app')
//     .pipe(server({
//       livereload: true,
//       directoryListing: true,
//       open: true
//     }));
// });

// gulp.task('watch', function() {
//   livereload.listen();
//   gulp.watch(['dist/**']).on('change', livereload.changed);
// });
