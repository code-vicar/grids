var path = require('path');
var _ = require('lodash');
var gulp = require('gulp');
var del = require('del');
var gutil = require('gulp-util');
var webpack = require('webpack');
var runSequence = require('run-sequence');

var HtmlwebpackPlugin = require('html-webpack-plugin');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');

// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = 'sourcemap';
myDevConfig.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);

gulp.task('webpack:build-dev', function (callback) {
    // run webpack
    devCompiler.run(function (err, stats) {
        if (err) throw new gutil.PluginError('webpack:build-dev', err);
        gutil.log('[webpack:build-dev]', stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task('webpack:build', function (callback) {
    process.env.NODE_ENV = 'production'
    // modify some webpack config options

    var myConfig = Object.create(webpackConfig);

    myConfig.plugins.splice(0, 1, new HtmlwebpackPlugin({
        template: './index.html',
        filename: '200.html',
        inject: true
    }))

    myConfig.plugins = myConfig.plugins.concat(
        new webpack.DefinePlugin({
            'process.env': {
                // This has effect on the react lib size
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.DedupePlugin()
    );

    myConfig.module.loaders.unshift({
        test: /\.jsx?$/,
        exclude: /code-vicar/,
        loader: 'uglify'
    })


    // run webpack
    webpack(myConfig, function (err, stats) {
        if (err) throw new gutil.PluginError('webpack:build', err);
        gutil.log('[webpack:build]', stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task('webpack-dev-server', function (callback) {
    // Start a webpack-dev-server
    var config = _.assign({}, webpackConfig, {
        entry: _.assign({}, webpackConfig.entry, {
            devServer: 'webpack-dev-server/client?http://localhost:9898/'
        })
    })

    new WebpackDevServer(webpack(config), {
        historyApiFallback: true,
        contentBase: path.resolve('./dist'),
        stats: {
            colors: true
        }
    }).listen(9898, 'localhost', function (err) {
        if (err) {
            throw new gutil.PluginError('webpack-dev-server', err)
        }
        gutil.log('[webpack-dev-server]', 'http://localhost:9898/')
    });
});

gulp.task('copy-static', function () {
    return gulp.src('src/static/**').pipe(gulp.dest('./dist/static'))
})

gulp.task('clean', function () {
    return del('dist')
})

// The development server (the recommended option for development)
gulp.task('default', function () {
    return runSequence('clean', 'copy-static', 'webpack-dev-server')
})

gulp.task('build-dev', function () {
    return runSequence('clean', 'webpack:build-dev', 'copy-static', 'build-dev-watch')
})
gulp.task('build-dev-watch', function () {
    return gulp.watch(['src/**/*'], ['webpack:build-dev'])
})

// Production build
gulp.task('build', function () {
    return runSequence('clean', 'webpack:build', 'copy-static')
})
