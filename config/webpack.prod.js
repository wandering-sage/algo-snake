const paths = require("./paths");
const common = require("./webpack.common");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = merge(common, {
	mode: "production",

	target: "browserslist",

	devtool: false,

	output: {
		filename: "js/[name]-[contenthash]-bundle.js",
		publicPath: "/",
		path: paths.build,
		clean: true,
		assetModuleFilename: 'assets/[hash][ext][query]'
	},

	optimization: {
		minimize: true,
		minimizer: [new CssMinimizerPlugin(), "..."],
		runtimeChunk: {
			name: "runtime",
		},
	},

	plugins: [
		// Extracts CSS into separate files
		new MiniCssExtractPlugin({
			filename: "styles/[name].[contenthash].css",
			chunkFilename: "[id].css",
		}),
	],

	module: {
		rules: [
			{
				test: /\.(scss|css)$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					"postcss-loader",
					"sass-loader",
				],
				
			},
		],
	},

	performance: {
		hints: false,
		maxEntrypointSize: 512000,
		maxAssetSize: 512000,
	},
});
