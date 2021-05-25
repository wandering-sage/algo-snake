const paths = require("./paths");
const common = require("./webpack.common");
const { merge } = require("webpack-merge");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = merge(common, {
	mode: "development",

	devtool: "source-map",

	// Spin up a server for quick development
	devServer: {
		contentBase: paths.build,
		open: true,
		hot: true,
		port: 3000,
	},

	target: 'web',
	
	module: {
		rules: [
			{
				test: /\.(scss|css)$/,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: { sourceMap: true },
					},
					{ loader: "postcss-loader", options: { sourceMap: true } },
					{ loader: "sass-loader", options: { sourceMap: true } },
				],
			},
		],
	},
	plugins: [
		// Only update what has changed on hot reload
		new webpack.HotModuleReplacementPlugin(),
	],
});
