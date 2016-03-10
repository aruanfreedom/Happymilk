"use strict";

var gulp = require("gulp"),
    wiredep = require('wiredep').stream,
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    sass = require('gulp-sass'),
    uncss = require('gulp-uncss'),
    connect = require('gulp-connect'),
    livereload = require('gulp-livereload'),
    clean = require('gulp-clean'),
    jade = require('gulp-jade'),
    plumber = require('gulp-plumber');

//autoprefixer
// gulp.task('autoprefixer', function() {
//     return gulp.src('app/css/style.css')
//         .pipe(autoprefixer({
//             browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3'],
//             cascade: false
//         }))
//         .pipe(gulp.dest('dist-css'));
// });

//server connect
gulp.task('connect', function() {
    connect.server({
        port: 8888,
        root: 'app/',
        livereload: true
    });
});

//Autoprefix
// gulp.task('autoprefixer', function() {
//     gulp.src('app/css/*.css')
//         .pipe(autoprefixer());
// });

gulp.task('sass', function() {
    gulp.src('app/scss/*.scss')
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'compressed'
            }))
        .pipe(gulp.dest('app/build/css/'))
        .pipe(connect.reload());
});

//Jade
gulp.task('jade', function() {
    return gulp.src('app/**/*.jade')
        .pipe(plumber())
        .pipe(connect.reload())
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest("app/build/"));
});

gulp.task('uncss', function() {
    return gulp.src('app/css/style.css')
        .pipe(uncss({
            html: ['app/index.html', 'app/auth.html'],
            ignore: [/^meta.foundation/, /f-topbar-fixed/, /contain-to-grid/, /sticky/, /fixed/]
        }))
        .pipe(gulp.dest('app/css/'));
});

gulp.task('clean', ['sass'], function() {
    return gulp.src('dist', {
            read: false
        })
        .pipe(clean());
});

gulp.task('html', function() {
    var assets = useref.assets();
    return gulp.src('app/build/*.html')
        .pipe(assets)
        .pipe(gulpif('**/*.js', uglify()))
        .pipe(gulpif('**/*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest("dist"));
});

gulp.task('bower', function() {
    gulp.src('app/**/*.html')
        .pipe(wiredep({
            directory: "app/bower_components"
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('hml', function() {
    gulp.src('app/**/*.html')
        .pipe(connect.reload());
});

gulp.task('js', function() {
    gulp.src('app/js/*.js')
        .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch('bower.json', ['bower']);
    gulp.watch('app/**/*.html', ['hml']);
    gulp.watch('app/js/*.js', ['js']);
    gulp.watch('app/scss/*.scss', ['sass']);
    gulp.watch('app/**/*.jade', ['jade']);
    //gulp.watch('app/scss/media.scss', ['sass']);
});

//default
gulp.task('default', ['connect', 'sass', 'watch', 'hml', 'js', 'jade']);
