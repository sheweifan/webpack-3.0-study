const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// console.log()

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
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	plugins: [
    	new webpack.HotModuleReplacementPlugin(),
		new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			title: 'test title'
		}),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: options.devtool && (options.devtool.indexOf("sourcemap") >= 0 || options.devtool.indexOf("source-map") >= 0)
		})
	],
	module: {
		// 从 webpack 3.0.0 开始
		noParse: function(content) {
		  return /lodash/.test(content);
		},
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
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
