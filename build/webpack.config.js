var path = require('path');
var glob = require('glob');
var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var projectRoot = path.resolve(__dirname, '../');
var APP_PATH = path.resolve(process.cwd());
var BUILD_PATH = path.resolve(APP_PATH, './dist/');

var cdnPath = 'http://localhost/dist';

var metadata = {
  host: cdnPath
};

module.exports = {
  // devtool: '#cheap-module-eval-source-map',
  devtool: '#cheap-module-source-map',
  entry: {
    main: './src/main.js',
    vendor: ['vue', 'vuex', 'vue-router']
  },

  //输出的文件名 合并以后的js会命名为bundle.js
  output: {
    path: BUILD_PATH,
    publicPath: cdnPath,
    filename: '/static/js/[name].js',
    sourceMapFilename: '[file].map',
    chunkFilename: '/static/js/chunk/[name].js'
  },
  module: {
    perLoaders: [
        {
            test: /\.vue$/,
            loader: 'eslint',
            include: projectRoot,
            exclude: /node_modules/
        },
        {
            test: /\.js$/,
            loader: 'eslint',
            include: projectRoot,
            exclude: /node_modules/
        }
    ],
    loaders: [
        {
          test: /\.js$/,
          loader: 'babel',
          include: projectRoot,
          exclude: /node_modules/
        },
        {
          test: /\.vue$/,
          loader: 'vue',
          include: projectRoot,
          exclude: /node_modules/
        },
        {
          test: /\.(css)$/,
          loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
        },
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'sass-loader?sourceMap')
        },
        {
          test: /\.(png|jpg|jpeg)$/,
          loader: 'url-loader',
          query:{
            limit:2000,
            path:path.join(process.cwd()),
            name:'/static/images/[name].[ext]'
          }
        },
        { 
          test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, 
          loader: 'url-loader',
          query: {
            limit: 1000,
            name: '/static/fonts/[name].[ext]'
          }
        }

    ]
  },
  resolve: {
      extensions: ['', '.js', '.vue'],
      alias: {
      }
  },

  vue: {
    loaders: {
      css: ExtractTextPlugin.extract("css"),
      sass: ExtractTextPlugin.extract("css!sass?sourceMap")
    }
  },

  plugins: [
    new ExtractTextPlugin('/static/css/[name].css'),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor']
    }),

    new webpack.DefinePlugin({
        metadata: JSON.stringify(metadata),
        PRODUCTION: JSON.stringify(false)
    }),
    new webpack.ProvidePlugin({
    }),
    new HtmlwebpackPlugin({
        filename:'./index.html',
        template:process.cwd() + '/src/index.html',
        inject:false
    }),

    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   },
    // })

  ]
};