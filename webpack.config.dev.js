// const webpack = require('webpack');
const path = require('path');

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'jupyter-ijavascript-utils.debug.js'
  },
  resolve: {
    fallback: {
      fs: false,
      path: false,
      stream: false,
      buffer: false,
      constants: false,
      util: false,
      events: false,
      assert: false
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
};

module.exports = config;
