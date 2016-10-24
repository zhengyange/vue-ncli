ar path = require('path');
var glob = require('glob');
var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var helpers = require('./helpers.js');
var projectName = helpers.getProjectName();

//一些文件夹的路径

var APP_PATH = path.resolve(process.cwd());
console.log(APP_PATH)
var BUILD_PATH = path.resolve(APP_PATH, './dist/');

//项目中的入口文件，应该会有好多
function getEntry() {
  var entry = {};
  glob.sync(process.cwd() + '/dev/entry/*.js').forEach(function (name) {
    console.log(name);
    var n = name.match(/([^/]+?)\.js/)[1];
    entry[n] = './dev/entry/'+n+'.js';
  });
  // entry['a'] = 'webpack-dev-server/client?http://localhost:3000';
  // entry['b'] = 'webpack/hot/only-dev-server';
  return entry;
}

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

// var cdnPath = 'http://static.twolun.com/m-static/' + projectName + '/dist';
var cdnPath = 'http://localhost:8080/dist';

var metadata = {
  host: cdnPath
};

module.exports = {
  //项目的文件夹 可以直接用文件夹名称 默认会找index.js 也可以确定是哪个文件名字
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
  },
  // devtool: '#eval-source-map',
  // devtool: '#cheap-module-eval-source-map',
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
    //和loaders一样的语法，很简单
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
        'iscroll-lite': path.join(process.cwd(), 'node_modules/iscroll/build/iscroll-lite.js'),
        'vue': path.join(process.cwd(), 'node_modules/vue/dist/vue.min.js'),
        'vuex': path.join(process.cwd(), 'node_modules/vuex/dist/vuex.min.js'),
        'vue-router': path.join(process.cwd(), 'node_modules/vue-router/dist/vue-router.min.js'),
        // 'common.scss': path.join(process.cwd(), '..','common/scss/common.scss'),
        // 'app.scss': path.join(process.cwd(), '..','common/scss/app.scss'),
        // 'Mask': path.join(process.cwd(), '..', 'common/components/Mask.vue')

      }
  },

  vue: {
    loaders: {
      css: 'style!css!autoprefixer!sass'
    }
  },

  //添加我们的插件 会自动生成一个html文件
  plugins: [
    // new ExtractTextPlugin('/static/css/[name].css', {'omit': 1, 'extract': true, 'remove': true}),
    new ExtractTextPlugin('/static/css/[name].css'),
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