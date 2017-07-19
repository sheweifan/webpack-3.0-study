const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var extractLESS = new ExtractTextPlugin("styles.css")

var options = process.env;

module.exports = {
	// devtool: "cheap-eval-source-map",
	devServer: {
		hot: true, // 告诉 dev-server 我们在使用 HMR
		contentBase: path.resolve(__dirname, 'dist'),
		publicPath: '/',
		open: false
	},
	entry: {
		app: './src/index.js',
		vendor: ['lodash']
    },
	output: {     
		filename: '[name].[hash].js',
		path: path.resolve(__dirname, 'dist')
	},
	plugins: [
		extractLESS,
    	new webpack.HotModuleReplacementPlugin(),
		new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			title: 'test title'
		}),
		new webpack.optimize.UglifyJsPlugin({
			// sourceMap: options.devtool && (options.devtool.indexOf("sourcemap") >= 0 || options.devtool.indexOf("source-map") >= 0)
		}),
		new webpack.optimize.CommonsChunkPlugin({
	      names: 'vendor',  //name是提取公共代码块后js文件的名字。
	    })
	],
	module: {
		// 从 webpack 3.0.0 开始
		noParse: function(content) {
		  return /lodash/.test(content);
		},
		rules: [
			{
				test: /\.less$/,
				loader: extractLESS.extract(['css-loader', 'less-loader', 'postcss-loader'])
			},
			{
				test: /\.css$/,
				loader: extractLESS.extract(['css-loader', 'postcss-loader'])
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					'file-loader'
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [
					'file-loader'
				]
			}
		]
	}
};


// https://yaowenjie.github.io/front-end/using-webpack-dashboard