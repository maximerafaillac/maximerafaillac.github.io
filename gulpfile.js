let gulp = require('gulp');
let less = require('gulp-less');
let browserSync = require('browser-sync').create();
let header = require('gulp-header');
let cleanCSS = require('gulp-clean-css');
let rename = require("gulp-rename");
let uglify = require('gulp-uglify');
let pkg = require('./package.json');


console.log('Node version: ' + process.version);


let banner = ['/*!\n',
    ' * <%= pkg.title %> v<%= pkg.version %> - <%= pkg.homepage %>\n',
    ' * Copyright 2016-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' */\n',
    ''
].join('');

// Compile LESS files from /less into /css
gulp.task('less', function() {
    return gulp.src('stylesheets/less/style.less')
        .pipe(less())
        .pipe(gulp.dest('assets/css/'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify compiled CSS
gulp.task('minify-css', function() {
    return gulp.src('assets/css/style.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('assets/css/'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('js/*.js')
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('assets/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function() {
    gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('vendor/bootstrap'));

    gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('vendor/jquery'));


    gulp.src([
        'node_modules/font-awesome/**',
        '!node_modules/font-awesome/**/*.map',
        '!node_modules/font-awesome/.npmignore',
        '!node_modules/font-awesome/*.txt',
        '!node_modules/font-awesome/*.md',
        '!node_modules/font-awesome/*.json'
    ])
        .pipe(gulp.dest('vendor/font-awesome'))
});

// Run everything
gulp.task('default', ['minify-css', 'minify-js']);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: ''
        }
    })
});

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'minify-css', 'minify-js'], function() {
    gulp.watch('stylesheets/css/*.css', ['minify-css']);
    gulp.watch('js/*.js', ['minify-js']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('*.html', browserSync.reload);
    // gulp.watch('js/**/*.js', browserSync.reload);
});