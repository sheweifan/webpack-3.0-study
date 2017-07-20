var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var Visualizer = require('webpack-visualizer-plugin'); // remove it in production environment
var extractLESS = new ExtractTextPlugin('styles.css')

var cfg = {
	APP_PATH: path.resolve(__dirname, 'src')
}

// 生成一个文件查看项目引用的所有模块的占比。
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var is_prod = process.argv[1].indexOf('webpack-dev-server') === -1

var plugins =  is_prod ? [
	new CleanWebpackPlugin(['./dist']),
	new webpack.optimize.UglifyJsPlugin({
	    compress: {
	        warnings: false,
	    },
	}),
	new Visualizer(),
	new BundleAnalyzerPlugin({
		defaultSizes: 'parsed',
		// generateStatsFile: true,
		statsOptions: { source: false }
	}), 
] : [
	new webpack.optimize.UglifyJsPlugin({
		sourceMap: true,
	    compress: {
	        warnings: true,
	    },
	}),
	new webpack.DefinePlugin({
	    'process.env': {
	        NODE_ENV: JSON.stringify('development'), //定义生产环境
	    },
	}),
	/*new webpack.DllReferencePlugin({
        context: path.join(__dirname, "dist"),
        //same as DLLPlugin
        manifest: require("./dll/vendor-manifest.json")
    }),
    new webpack.DllPlugin({
		// * path
		// * 定义 manifest 文件生成的位置
		// * [name]的部分由entry的名字替换
		path: path.join(__dirname, 'dist', 'vendor-manifest.json'),
		// * name
		// * dll bundle 输出到那个全局变量上
		// * 和 output.library 一样即可。 
		name: 'vendor_library'
    })
	*/
];

module.exports = {
	devtool: is_prod ? '' : 'source-map' ,
	devServer: {
		hot: true, // 告诉 dev-server 我们在使用 HMR
		contentBase: path.resolve(__dirname, 'dist'),
		publicPath: '/',
		open: false,
		disableHostCheck: true
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
		// 样式
		extractLESS,
    	// 模块热加载
    	new webpack.HotModuleReplacementPlugin(),
    	// 生成html
		new HtmlWebpackPlugin({
			title: 'test title',
			template: './src/index.tpl.html'
		}),
		// 体积变小，加快运行速度
	    new webpack.optimize.ModuleConcatenationPlugin(),
	    new webpack.optimize.CommonsChunkPlugin({
			names: 'vendor',  //name是提取公共代码块后js文件的名字。
	    }),
	].concat(plugins),
	module: {
		// 从 webpack 3.0.0 开始
		// noParse: function(content) {
		//   return /lodash/.test(content);
		// },
		
	    noParse: [/moment.js/],
		rules: [
			{
				test: /\.(less|css)$/i,
				use: ExtractTextPlugin.extract({
		          fallback: 'style-loader',
		          use: [
		            'css-loader', 'postcss-loader', 'less-loader'
		          ]
		        })
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
		mainFiles: ['index.web','index'],
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
	target: 'web'
};
// http://blog.csdn.net/qq_24840407/article/details/56035713
// https://doc.webpack-china.org/plugins/dll-plugin/
// https://github.com/ant-design/antd-mobile-samples/blob/master/web-webpack2/webpack.config.js
// https://yaowenjie.github.io/front-end/using-webpack-dashboard