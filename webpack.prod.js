const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  performance: {
    maxEntrypointSize: 90000,
    maxAssetSize: 900000,
  },
  optimization: {
    usedExports: true,
    minimize: true,
    splitChunks: false,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
  plugins: [new CleanWebpackPlugin()],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    publicPath: './',
  },
});
