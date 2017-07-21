var path = require('path');
var webpack = require('webpack');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var merge = require('webpack-merge')

var Visualizer = require('webpack-visualizer-plugin'); // remove it in production environment
var extractLESS = new ExtractTextPlugin('styles.css')

var cfg = {
	APP_PATH: path.resolve(__dirname, 'src'),
	DIST_PATH: path.resolve(__dirname, 'dist')
}

// 生成一个文件查看项目引用的所有模块的占比。
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var is_prod = process.argv[1].indexOf('webpack-dev-server') === -1
console.log('is_prod',is_prod)
var plugins =  is_prod ? [
	// 清理
	new CleanWebpackPlugin([cfg.DIST_PATH]),
	//压缩代码
	new webpack.optimize.UglifyJsPlugin({
	  // 最紧凑的输出
	    beautify: false,
	    // 删除所有的注释
	    comments: false,
	    compress: {
	      // 在UglifyJs删除没有用到的代码时不输出警告  
	      warnings: false,
	      // 删除所有的 `console` 语句
	      // 还可以兼容ie浏览器
	      drop_console: true,
	      // 内嵌定义了但是只用到一次的变量
	      collapse_vars: true,
	      // 提取出出现多次但是没有定义成变量去引用的静态值
	      reduce_vars: true,
	    }
	}),	
	new Visualizer(),
	new BundleAnalyzerPlugin({
		defaultSizes: 'parsed',
		// generateStatsFile: true,
		statsOptions: { source: false },
	}),
	// 公共js
    new webpack.optimize.CommonsChunkPlugin({
		names: 'vendor',  //name是提取公共代码块后js文件的名字。
    }), 
] : [
	
	new webpack.DefinePlugin({
	    'process.env': {
	        NODE_ENV: JSON.stringify('development'), //定义生产环境
	    },
	}),
	new webpack.DllReferencePlugin({
		context: __dirname,
		name: 'vendor',
		manifest: require('./manifest.json'),
	})
	// http://blog.csdn.net/a245452530/article/details/56485558
	// new webpack.DllPlugin({
	//      path: path.join(__dirname, './dist/manifest.json'),
	//      name: '[name]',//在这个例子中将生成lib.js
	//      context: __dirname,
	// })
	// //另一个配置文件
	// new webpack.DllReferencePlugin({
	//   context: __dirname,
	//   manifest: require('./dist/manifest.json'),
	// })
];

module.exports = {
	devtool: is_prod ? '' : 'source-map' ,
	// 配置静态服务器
	devServer: {
		hot: true, // 告诉 dev-server 我们在使用 HMR
		contentBase: cfg.DIST_PATH,
		publicPath: '/',
		open: false,
        inline: true,
		disableHostCheck: true
	},
	// 入口
	entry: {
		app: './src/index.js',
		// vendor: ['react','react-dom']
    },
    // 出口
	output: {     
		filename: '[name].js',
		path: cfg.DIST_PATH,
		publicPath: '/'
	},
	// 插件
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
		// alias: {
		// 	'react': 'react/dist/react.js',
		// 	'react-dom': 'react-dom/dist/react-dom.js'
		// }
	},
	target: 'web'
};
// https://mp.weixin.qq.com/s/Z6CXa_5HP4RccfebxzmNng
// http://blog.csdn.net/qq_24840407/article/details/56035713
// https://doc.webpack-china.org/plugins/dll-plugin/
// https://github.com/ant-design/antd-mobile-samples/blob/master/web-webpack2/webpack.config.js
// https://yaowenjie.github.io/front-end/using-webpack-dashboard