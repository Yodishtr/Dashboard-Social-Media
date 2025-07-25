// Initialize modules
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// use dart sass for @use
//sass.compiler = require('dart-sass');

// Sass task
function scssTask() {
    return src('app/scss/style.scss', { sourcemaps: true })
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(dest('dist', { sourcemaps: '.' }));
}

// Javascript Task
function jsTask() {
    return src('app/js/script.js', { sourcemaps: true })
        .pipe(babel({ presets: ['@babel/preset-env'] }))
        .pipe(terser())
        .pipe(dest('dist', { sourcemaps: '.' }));
}

// Browser Sync
function browsersyncServe(cb) {
    browsersync.init({
        server: {
            baseDir: '.',
        }, 
        notify: {
            styles: {
                top: 'auto',
                bottom: '0',
            }, 
        },
    });
    cb();
}

function browsersyncReload(cb) {
    browsersync.reload();
    cb();
}

// Watch Task
function watchTask() {
    watch('*.html', browsersyncReload);
    watch(
        ['app/scss/**/*.scss', 'app/**/*.js'],
        series(scssTask, jsTask, browsersyncReload)
    );
}

// Default Gulp task
exports.default = series(scssTask, jsTask, browsersyncServe, watchTask);