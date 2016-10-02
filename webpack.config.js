var path = require('path')
var HTMLWebpackPlugin = require('html-webpack-plugin')
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
	template: __dirname + '/app/index.html',
	filename: 'index.html',
	inject: 'body'
})

module.exports = {
	entry: __dirname + '/app/index.js',
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader'
			}
		]
	},
	output: {
		filename: 'index.js',
		path: __dirname + '/build'
	},
	resolve : {
		extensions: ['','.js'],
		root: path.resolve(__dirname)
	},
	plugins: [HTMLWebpackPluginConfig]
}