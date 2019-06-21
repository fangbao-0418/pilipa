var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
const extractCommon = new ExtractTextPlugin({
  filename: '[name]-[hash].css',
  allChunks: true
})
module.exports = {
  mode: 'development',
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
    './index',
    './dev/index'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        include: [path.resolve(__dirname, 'components'), path.resolve(__dirname, 'dev')],
        use: [
          'source-map-loader',
          'eslint-loader'
        ]
      },
      {
        test: /\.(js|jsx)$/,
        include: [path.resolve(__dirname, 'components'), path.resolve(__dirname, 'dev')],
        use: [
          'babel-loader'
        ]
      },
      {
        enforce: 'pre',
        test: /\.tsx$/,
        include: [path.resolve(__dirname, 'components'), path.resolve(__dirname, 'dev')],
        use: [
          'tslint-loader'
        ]
      },
      {
        test: /\.(ts|tsx)$/,
        include: [path.resolve(__dirname, 'components'), path.resolve(__dirname, 'dev')],
        loader: 'awesome-typescript-loader',
        options: {
          useCache: true,
          useBabel: true,
          babelOptions: {
            babelrc: false, /* Important line */
            presets: [
              [
                'env',
                {
                  'targets': {
                    'browsers': ['> 5%', 'last 2 versions']
                  },
                  'modules': false
                }
              ],
              'stage-0',
              'react'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: extractCommon.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader'
          }, {
            loader: 'postcss-loader'
          }]
        })
      },
      {
        test: /\.styl$/,
        exclude: /node_modules/,
        use: extractCommon.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                localIdentName: '[local]-[hash:base64:5]',
                sourceMap: true
              }
            }, {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            }, {
              loader: 'stylus-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        })
      },
      {
        test: /\.(png|jpe?g|git)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: '[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './dev/index.html',
      inject: 'true',
      favicon: null
    }),
    new webpack.HotModuleReplacementPlugin(),
    extractCommon
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.min.js', '.styl', '.css']
  },
  devtool: 'source-map'
}
