const merge = require('webpack-merge');
const config = require('./webpack.config');
const nodemonPlugin = require('nodemon-webpack-plugin');
const path = require('path');
const rootPath = path.resolve(__dirname, '../');

module.exports = merge(config, {
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    ...config.plugins,
    new nodemonPlugin({
      watch: path.resolve(rootPath, 'dist'),
      script: path.resolve(rootPath, 'dist/server.js')
    })
  ]
});