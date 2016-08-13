var _ = require('lodash');
var gulp = require('gulp');
var del = require('del');
var gutil = require('gulp-util');
var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');

// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = 'sourcemap';
myDevConfig.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);

gulp.task('webpack:build-dev', ['clean'], function (callback) {
    // run webpack
    devCompiler.run(function (err, stats) {
        if (err) throw new gutil.PluginError('webpack:build-dev', err);
        gutil.log('[webpack:build-dev]', stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task('webpack:build', ['clean'], function (callback) {
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

// The development server (the recommended option for development)
gulp.task('default', ['webpack-dev-server']);

gulp.task('build-dev', ['clean', 'webpack:build-dev'], function () {
    gulp.watch(['src/**/*'], ['webpack:build-dev']);
});

// Production build
gulp.task('build', ['clean', 'webpack:build']);

gulp.task('clean', function () {
    return del('dist')
})
