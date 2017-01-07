var gulp = require('gulp');
var packageJson = require('./package.json');

// Include plugins
var plugins = require('gulp-load-plugins')();
//var browserSync = require('browser-sync');

var header = ['/*!\n',
    ' * <%= packageJson.title %> v<%= packageJson.version %> - <%= packageJson.homepage %>\n',
    ' * Copyright 2016-' + (new Date()).getFullYear(), ' <%= packageJson.author %>\n',
    ' */\n',
    ''
].join('');

var source = './';
var destination = './dist';

//compile LESS, clean and beautify CSS
gulp.task('css', function () {
  //return gulp.src(source + '/assets/css/styles.less')
  return gulp.src(source + 'less/*.less')
    .pipe(plugins.less())
    .pipe(plugins.csscomb())
    .pipe(plugins.cssbeautify({indent: '  '}))
    .pipe(plugins.header(header, { packageJson: packageJson }))
    .pipe(plugins.csso())
    .pipe(plugins.rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest(destination + '/css/'));
});


//Minify CSS
gulp.task('minify', function () {
  return gulp.src(destination + '/css/*.css')
    .pipe(plugins.csso())
    .pipe(plugins.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(destination + '/css/'));
});


// Uglify and concats Js files
gulp.task('js', function() {
  return gulp.src(source + 'js/*.js')
    .pipe(plugins.uglify())
    .pipe(plugins.concat('global.min.js'))
    .pipe(plugins.header(header, { packageJson: packageJson }))
    .pipe(gulp.dest(destination + '/assets/js/'));
});

// Optimize images
//gulp.task('img', function () {
//  return gulp.src(source + '/assets/img/*.{png,jpg,jpeg,gif,svg}')
//    .pipe(plugins.imagemin())
//    .pipe(gulp.dest(destination + '/assets/img'));
//});


// Watching less files
gulp.task('watch', function () {
  gulp.watch(source + 'less/*.less', ['css']);
});

gulp.task('build', ['css', 'js']);
gulp.task('prod', ['build',  'minify']);
gulp.task('default', ['build']);