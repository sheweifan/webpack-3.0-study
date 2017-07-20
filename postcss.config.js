module.exports = {
    plugins: [
        require('autoprefixer')({
        	browsers: ['iOS >= 7', 'Android >= 2']
        }),
        require('postcss-pxtorem')({ rootValue: 100, propWhiteList: [] }),
    ]
}