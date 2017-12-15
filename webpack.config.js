const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'src/main.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle-[hash].js',
    },
    //devtool: 'eval-source-map',
    module: {
        rules: [{
            test: /\.js$/,
            use: 'babel-loader',
            exclude: /node_modules/,
        }, {
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ]
        }, {
            test: /\.ttf$|\.woff$/,
            use: 'file-loader'
        }, {
            test: /\.vue$/,
            use: 'vue-loader'
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'src/index.tpl.html') }),
        new webpack.optimize.UglifyJsPlugin()
    ],
    externals: {
        
    }
}