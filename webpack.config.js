'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');

const isDev = process.env.NODE_ENV === 'development'; // 是否开发环境
const config = require('./src/config')[isDev ? 'dev' : 'build']; // template属性

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].[hash:6].js',
    publicPath: '' //通常是CDN地址
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/ //排除 node_modules 目录
      },
      {
        test: /\.(c|le)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            // options: {
            //   hmr: isDev,
            //   reloadAll: true
            // }
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return require('autoprefixer')();
              }
            }
          },
          'less-loader'
        ],
        exclude: /node_modules/ //排除 node_modules 目录
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'url-loader', //url-loader内置了file-loader
            options: {
              limit: 102400, //10K
              esModule: false,
              name: '[name].[hash:6].[ext]',
              outputPath: './assets'
            }
          }
        ],
        exclude: /node_modules/ //排除 node_modules 目录
      }
    ]
  },
  devServer: {
    port: '3000', //默认是8080
    quiet: false, //默认不启用
    inline: true, //默认开启 inline 模式，如果设置为false,开启 iframe 模式
    stats: 'errors-only', //终端仅打印 error
    overlay: false, //默认不启用
    clientLogLevel: 'silent', //日志等级
    compress: true //是否启用 gzip 压缩
  },
  // devtool: isDev ? 'cheap-module-eval-source-map' : 'source-map', //开发环境下使用
  devtool: isDev ? 'cheap-module-eval-source-map' : 'none', //开发环境下使用
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      config: config.template
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!dll', '!dll/**'] //不删除dll目录下的文件
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './public/js/*.js',
          to: path.resolve(__dirname, './dist/js'),
          flatten: true,
          globOptions: {
            ignore: ['**/other.js']
          }
        }
      ]
    }),
    new webpack.ProvidePlugin({
      Vue: ['vue/dist/vue.esm.js', 'default']
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash:6].css'
    }),
    new OptimizeCssAssetsWebpackPlugin()
  ]
};
