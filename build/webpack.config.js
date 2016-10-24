var path = require('path');
var glob = require('glob');
var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

//一些文件夹的路径

var APP_PATH = path.resolve(process.cwd());
var BUILD_PATH = path.resolve(APP_PATH, './dist/');

function getHtmlPlugin(type) {
    var plugins = [];
    glob.sync(process.cwd() + '/src/index.html').forEach(function (name) {
        var n = name.match(/([^/]+?)\.html/)[1];
        plugins.push(
            new HtmlwebpackPlugin({
                filename:'./index.html',
                template:name,
                inject:false
            })
        )
    });
    return plugins;
}

var cdnPath = 'http://localhost:8080/dist';

var metadata = {
  host: cdnPath
};

module.exports = {
  devtool: '#cheap-module-eval-source-map',
  entry: {
    main: './src/main.js',
    vendor: ['vue', 'vuex', 'vue-router']
  },

  //输出的文件名 合并以后的js会命名为bundle.js
  output: {
    path: BUILD_PATH,
    publicPath: cdnPath,
    filename: '/static/js/[name].js',
    sourceMapFilename: '/static/js/[file].map',
    chunkFilename: '/static/js/chunk/[name].js'
  },
  module: {
    perLoaders: [
        {
            test: /\.js$/,
            loader: 'eslint',
        }
    ],
    loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel',
          // include: APP_PATH + '/dev',
          exclude: /node_modules/
        },
        {
          test: /\.vue$/,
          loader: 'vue',
          // include: APP_PATH + '/dev',
          exclude: /node_modules/
        },
        {
          test: /\.(css)$/,
          // loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
          loader: ExtractTextPlugin.extract({
            fallbackLoader: "style-loader",
                loader: "css-loader"
          })
        },
        {
          test: /\.scss$/,
          // loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'sass-loader?sourceMap')
          loader: ExtractTextPlugin.extract({
            fallbackLoader: "style-loader",
                loader: ["css-loader", "sass-loader?sourceMap"]
          })
        },
        {
          test: /\.(png|jpg|jpeg)$/,
          loader: 'url-loader',
          query:{
            limit:10000,
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
      // require时省略的扩展名，如：require('module') 不需要module.js
      extensions: ['', '.js', '.vue'],
      // 别名，可以直接使用别名来代表设定的路径以及其他
      alias: {


      }
  },

  vue: {
    loaders: {
      css: 'style!css!autoprefixer!sass'
    }
  },

  //添加我们的插件 会自动生成一个html文件
  plugins: [
    new ExtractTextPlugin('/static/css/[name].csss', {allChunks: true, 'omit': 1, 'extract': true, 'remove': true}),
      //把入口文件里面的数组打包成verdors.js
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor']
    }),

    new webpack.DefinePlugin({
        metadata: JSON.stringify(metadata),
        PRODUCTION: JSON.stringify(true)
    }),
    new webpack.ProvidePlugin({
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })

  ].concat(getHtmlPlugin()),
};