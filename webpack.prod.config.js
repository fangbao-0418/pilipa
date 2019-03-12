var path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const extractCommon = new ExtractTextPlugin({
  filename: 'pilipa.min.css',
  allChunks: true
})
const extractCommon2 = new ExtractTextPlugin({
  filename: 'pilipa.css',
  allChunks: true
})
module.exports = [
  {
    mode: 'production',
    entry: './index',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'pilipa.min.js',
      library: 'pilipa',
      libraryTarget: 'umd'
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            'source-map-loader',
            'eslint-loader'
          ]
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            'babel-loader'
          ]
        },
        {
          enforce: 'pre',
          test: /\.tsx$/,
          exclude: /node_modules/,
          use: [
            'tslint-loader'
          ]
        },
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          include: [path.resolve(__dirname, 'components')],
          use: [
            {
              loader: 'babel-loader'
            },
            {
              loader: 'ts-loader'
            }
          ]
        },
        {
          test: /\.css$/,
          use: extractCommon.extract({
            fallback: 'style-loader',
            use: [
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  config: {
                    ctx: {
                      env: 'production'
                    }
                  }
                }
              }
            ]
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
                  localIdentName: '[local]-[hash:base64:5]'
                }
              }, {
                loader: 'postcss-loader',
                options: {
                  config: {
                    ctx: {
                      env: 'production'
                    }
                  }
                }
              }, {
                loader: 'stylus-loader'
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
      extractCommon,
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true
          }
        }
      }),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.IgnorePlugin(/(font-awesome)/)
    ],
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.min.js', '.styl', '.css']
    },
    externals: {
      jquery: 'jquery',
      'ali-oss': 'ali-oss',
      react: 'react',
      'react-dom': 'react-dom',
      viewerjs: 'viewerjs'
    },
    performance: {
      // hints: false,
      maxAssetSize: 5 * 1024 * 1024,
      maxEntrypointSize: 5 * 1024 * 1024
    }
  },
  {
    mode: 'development',
    entry: './index',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'pilipa.js',
      library: 'pilipa',
      libraryTarget: 'umd'
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            'source-map-loader',
            'eslint-loader'
          ]
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            'babel-loader'
          ]
        },
        {
          enforce: 'pre',
          test: /\.tsx$/,
          exclude: /node_modules/,
          use: [
            'tslint-loader'
          ]
        },
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          include: [path.resolve(__dirname, 'components')],
          use: [
            {
              loader: 'babel-loader'
            },
            {
              loader: 'ts-loader'
            }
          ]
        },
        {
          test: /\.css$/,
          use: extractCommon2.extract({
            fallback: 'style-loader',
            use: [
              'css-loader',
              {
                loader: 'postcss-loader'
              }
            ]
          })
        },
        {
          test: /\.styl$/,
          exclude: /node_modules/,
          use: extractCommon2.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  localIdentName: '[local]-[hash:base64:5]'
                }
              }, {
                loader: 'postcss-loader'
              }, {
                loader: 'stylus-loader'
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
      extractCommon2,
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.IgnorePlugin(/(font-awesome)/)
    ],
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.min.js', '.styl', '.css']
    },
    externals: {
      jquery: 'jquery',
      'ali-oss': 'ali-oss',
      react: 'react',
      'react-dom': 'react-dom',
      viewerjs: 'viewerjs'
    },
    performance: {
      // hints: false,
      maxAssetSize: 5 * 1024 * 1024,
      maxEntrypointSize: 5 * 1024 * 1024
    }
  }
]
