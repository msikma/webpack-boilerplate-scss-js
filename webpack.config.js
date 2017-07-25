const webpack = require('webpack');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');

module.exports = {
  context: path.resolve(__dirname),
  entry: {
    // Javascript entry points. Currently only one; if desired, split by adding more entry points,
    // which will lead to multiple files being emitted.
    index: './src/index.js',
    // Main entry point for our CSS. This file is not directly output as a bundle because
    // the extract-text-webpack-plugin will take care of emitting the file as CSS.
    styles: './styles/style.scss'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        // CSS extraction. Note that we do not use style-loader, which is not needed because
        // we never require() our CSS from inside our JS.
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin('[name].[hash].css'),
    // Our styles entry point would normally emit an unnecessary JS bundle containing the CSS.
    // This line prevents it from being emitted.
    new IgnoreEmitPlugin(/styles\..+?\.js$/),
    // Generate a manifest.json file containing our emitted bundles.
    new WebpackAssetsManifest()
  ]
};
