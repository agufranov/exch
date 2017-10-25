const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
	template: './src/index.html',
	filename: 'index.html',
	inject: 'body'
})

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	context: __dirname,
	resolve: {
		extensions: ['.js', '.jsx', '.json', '*']
	},
	module: {
		rules: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			options: {
				presets: ['react', 'es2015']
			}
		}, {
			test: /\.css$/,
			loader: 'style-loader!css-loader' 
		}]
	},
	plugins: [HtmlWebpackPluginConfig]
};
