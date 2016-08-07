var webpack = require('webpack');
var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    entry: {
        app: './src/index.js'
    },
    output: {
        path: path.resolve('./dist'),
        filename: '[name].bundle.js',
        publicPath: '/'
    },
    module: {
        loaders: [
            {
                include: [path.resolve(__dirname, 'src')],
                test: /\.jsx?$/,
                loader: ['babel'],
                exclude: /(node_modules)/,
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ],
        postLoaders: [
            {
                include: path.resolve(__dirname, 'node_modules/pixi.js'),
                loader: 'transform/cacheable?brfs'
            }
        ]
    },
    plugins: [
        new HtmlwebpackPlugin({
            template: './index.html',
            inject: true
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};
