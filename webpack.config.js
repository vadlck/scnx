const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: './src',
	output: {
		path: path.join(__dirname, 'public'),
		filename: 'main.js'
	},
	devServer: {
		contentBase: path.join(__dirname, 'public')
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						"presets": [
							"env",
							"react"
						],
						"plugins": [
							"transform-class-properties",
							"transform-object-rest-spread"
						]
					}
				}
			},
			{
				test: /\.(gif|png|jpg)$/,
				use: ['file-loader']
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'sass-loader'
				]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin('main.css')
	]
}