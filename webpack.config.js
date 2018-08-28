const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let hash = '213231';

module.exports = {
	entry: './src',
	output: {
		path: path.join(__dirname, 'public'),
		filename: 'main.[hash].js'
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
		new MiniCssExtractPlugin('main.css'),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'public/index.html')
		})
	]
}