const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var extractLESS = new ExtractTextPlugin("styles.css")

var options = process.env;

var cfg = {
	APP_PATH: path.resolve(__dirname, 'src')
}

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
		vendor: ['react','react-dom']
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
			title: 'test title',
			template: './src/index.tpl.html'
		}),
		// new webpack.optimize.UglifyJsPlugin({
			// sourceMap: options.devtool && (options.devtool.indexOf("sourcemap") >= 0 || options.devtool.indexOf("source-map") >= 0)
		// }),
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
				test: /\.(less|css)$/i,
				loader: extractLESS.extract(['style-loader','css-loader', 'postcss-loader','less-loader'])
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
   				include: cfg.APP_PATH,
				use: [
					'file-loader'
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
   				include: cfg.APP_PATH,
				use: [
					'file-loader'
				]
			},
			{
               test: /\.(js|jsx)$/,
   				include: cfg.APP_PATH,
   				loader: 'babel-loader'
            },
            { 	
            	test: /\.(svg)$/i,
                loader: 'svg-sprite-loader',
                include: [
                    require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
                    // path.resolve(__dirname, 'src/static/icon'),  // 自己私人的 svg 存放目录
                ],
            }

		]
	},
	resolve: {
		mainFiles: ["index.web","index"],// 这里哦
		modules: ['app', 'node_modules', path.join(__dirname, './node_modules')],
		extensions: [
			'.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.ts', '.tsx',
			'.js',
			'.jsx',
			'.react.js',
			'.less'
		],
		mainFields: [
			'browser',
			'jsnext:main',
			'main',
		],
	},
};


// https://yaowenjie.github.io/front-end/using-webpack-dashboard