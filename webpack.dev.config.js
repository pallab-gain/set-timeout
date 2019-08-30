const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const { name } = require('./package');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const commonConfig = require('./webpack.common.config');

function resolve (dir) {
  return path.join(__dirname, dir);
}

const outputDirectory = 'dist';
module.exports = merge(commonConfig, {
  devtool: 'inline-source-map',
  output: {
    filename: `${name}.js`
  },
  optimization: {
    minimize: false
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [resolve(outputDirectory)]
    }),
    new webpack.DefinePlugin({
      __PRODUCTION__: JSON.stringify(false)
    })
  ],
  devServer: {
    port: 3000,
    open: true,
    disableHostCheck: true,
    writeToDisk: true,
    contentBase: resolve('/'),
    openPage: '__test__/src/browser/index.test.html'
  }
});
