var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');
var bs = require('browser-sync').create();

var config = {
    bootstrapDir: './bower_components/bootstrap-sass',
    publicDir: './public',
};

gulp.task('browser-sync', function() {
    bs.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('watch', ['browser-sync'], function () {
    gulp.watch('src/*.jsx', ['build']);
    gulp.watch("scss/*.scss", ['scss']);
    gulp.watch("*.html").on('change', bs.reload);
});

gulp.task('scss', function() {
    return gulp.src('./scss/app.scss')
    .pipe(sass({includePaths: [config.bootstrapDir + '/assets/stylesheets'],}))
    .pipe(gulp.dest(config.publicDir))
    .pipe(bs.reload({stream: true}));
});

gulp.task('default', ['scss', 'browser-sync', 'watch']);
