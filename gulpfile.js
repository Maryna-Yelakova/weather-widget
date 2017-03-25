'use strict';

var gulp = require('gulp'),
    rimraf = require('rimraf'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    mainBowerFiles = require('gulp-main-bower-files'),
    gls = require('gulp-live-server'),
    runSequence = require('gulp-run-sequence'),
    extend = require('extend'),
    parseArgs = require('minimist'),
    watch = require('gulp-watch');

var path = {
    build: {
        jsorder: [
            'frontend/src/app/app.js',
            'frontend/src/app/services/weather-widget-service.js',
            'frontend/src/app/controllers/weather-widget-controller.js',
            'frontend/src/app/directives/weather-widget.js'
        ]
    },
    libs:{
        overrides: {
            angular: {
                main: 'angular.min.js'
             },
            jquery: {
                main: 'dist/jquery.min.js'
            },
            bootstrap: {
                main: 'dist/**/*.*'
            }
        }
    },
    src: {
        js: 'frontend/src/app/**/*.js',
        bower:'bower.json',
        html: 'frontend/src/app/directives/*.html',
        indexhtml: 'frontend/src/app/index.html',
        concatJS: [
            'frontend/src/app/app.js',
            'frontend/src/app/services/weather-widget-service.js',
            'frontend/src/app/controllers/weather-widget-controller.js',
            'frontend/src/app/directives/weather-widget.js'
        ]
    },
    watch: {
        js: 'frontend/src/app/**/*.js',
        bower:'bower.json',
        html: 'frontend/src/app/directives/*.html',
        indexhtml: 'frontend/src/app/index.html'
    },
    dst:{
        main:'frontend/build',
        libs:'frontend/build/libs'
    }
};

var config = extend({
    env: process.env.NODE_ENV
}, parseArgs(process.argv.slice(2)));


gulp.task('set-dev-node-env', function() {
    return process.env.NODE_ENV = config.env = 'development';
});
gulp.task('set-prod-node-env', function() {
    return process.env.NODE_ENV = config.env = 'production';
});

gulp.task('clean', function (cb) {
    rimraf(path.dst.main + '/*', cb);
});
gulp.task('build:js', function(){
    gulp.src(path.src.concatJS)
        .pipe(uglify())
        .pipe(concat('all.js'))
        .pipe(gulp.dest(path.dst.main))
});
gulp.task('copy:libs', function() {
    gulp.src(path.src.bower)
        .pipe(mainBowerFiles(path.libs))
        .pipe(gulp.dest(path.dst.libs))
});
gulp.task('copy:html', function(){
    gulp.src(path.src.html)
        .pipe(gulp.dest(path.dst.main));
    gulp.src(path.src.indexhtml)
        .pipe(gulp.dest(path.dst.main));
});
gulp.task('watch', function() {
    watch([path.watch.js], function() {
        gulp.start('build:js');
});
    watch([path.watch.indexhtml], function() {
        gulp.start('copy:html');
    });
    watch([path.watch.bower], function() {
        gulp.start('copy:libs');
    });
});
gulp.task('serve', function () {
    var server = gls.new('backend/index.js');
    server.start();
});

gulp.task('build', ['build:js','copy:libs','copy:html']);

gulp.task('dev', ['set-dev-node-env'], function() {
    return runSequence(
        'clean',
        'build',
        'serve'
    );
});

gulp.task('prod', ['set-prod-node-env'], function() {
    return runSequence(
        'build'
    );
});

gulp.task('default', ['dev']);

