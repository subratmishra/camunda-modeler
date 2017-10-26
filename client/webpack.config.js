const webpack = require('webpack');

const path = require('path');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var config = {
  entry: {
    'index': [ './lib/index.js' ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            [ 'env', {
              loose: true,
              modules: false,
              targets: {
                browsers: [ 'Chrome >= 56' ]
              }
            } ]
          ],
          plugins: [
            [ 'transform-react-jsx', { 'pragma': 'h' } ]
          ]
        }
      },
      {
        test: /\.(bpmn|dmn|cmmn|xml|html|css|svg)$/,
        use: 'raw-loader'
      }
    ],
    noParse: /sax/
  },
  resolve: {
    modules: [
      path.join(__dirname, 'lib'),
      'node_modules'
    ]
  },
  node: {
    console: false,
    global: true,
    process: 'mock',
    Buffer: false
  },
  output: {
    path: path.resolve(__dirname, '../public'),
    filename: '[name].js'
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin()
  ],
  devtool: 'source-map'
};

if (process.env.NODE_ENV === 'production') {

  config.plugins.push(
    new UglifyJSPlugin({
      parallel: true,
      sourceMap: true,
      uglifyOptions: {
        ecma: 8
      }
    })
  );
}


module.exports = config;