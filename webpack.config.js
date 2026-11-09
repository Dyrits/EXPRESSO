'use strict';
const path = require('node:path');
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: { path: path.join(__dirname, 'public/js'), filename: 'bundle.js' },
  devtool: 'source-map',
  module: {
    rules: [{
      test: /jsx?$/, exclude: /node_modules/, loader: 'babel-loader',
      options: { presets: ['@babel/preset-env', '@babel/preset-react'] }
    }]
  },
  resolve: { fallback: { fs: false } }
};
