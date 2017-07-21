var path = require('path');
var webpack = require('webpack');

var merge = require('webpack-merge')
// var baseConfig = require('./webpack.config.js')

var cfg = {
	APP_PATH: path.resolve(__dirname, 'src'),
	DIST_PATH: path.resolve(__dirname, 'dist')
}

var dll = {
	entry: {
		vendor: ['react','react-dom']
    },
    // 出口
	output: {
		filename: '[name].js',
		path: cfg.DIST_PATH,
	    library: 'vendor'
	},

	plugins: [
		new webpack.DllPlugin({
		     path: './manifest.json',
		     name: 'vendor',
		     context: __dirname,
		})
	]
}


module.exports = dll