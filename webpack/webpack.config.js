const path = require('path');
const webpack = require( "webpack" );
const nodeExternals = require('webpack-node-externals');
const terserPlugin = require('terser-webpack-plugin');
const rootPath = path.resolve(__dirname, '../');

module.exports = {
  devtool: false,
  entry: './src/server.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  target: 'node',
  externals: [nodeExternals()],
  resolve: {
    extensions: [ '.ts', '.js' ],
    modules: [path.resolve(rootPath, 'src'), 'node_modules'],
    alias: {
      '~/src': path.resolve(rootPath, 'src'),
      '~/entity': path.resolve(rootPath, 'src/graphql/entity'),
      '~/types': path.resolve(rootPath, 'src/@types'),
      '~/graphql': path.resolve(rootPath, 'src/graphql'),
      '~/utils': path.resolve(rootPath, 'src/utils'),
    }
  },
  optimization: {
    minimizer  : [
        new terserPlugin({
            cache: true,
            parallel: true,
            terserOptions: {
                compress: true,
                ecma : 6,
                keep_classnames: true
            }
        })
    ]
  },
  output: {
    filename: 'server.js',
    path: path.resolve(rootPath, 'dist')
  },
  plugins: [
    new webpack.IgnorePlugin( /uws/ )
  ],  
  resolveLoader: {
    "modules": [
      "./node_modules"
    ]
  }
};