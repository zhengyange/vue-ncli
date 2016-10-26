# vue-ncli
用nginx作为服务器开发vue，同时兼有实时打包，hot-reload，error-location等功能  

## [项目地址](https://github.com/twolun/vue-ncli)

## 做脚手架的目的
```
最近开始用vue写一个后台管理系统，前后端分离，服务端用java，前端直接调用接口进行渲染。  
此间会就产生一个跨域的问题，那么前端资源就需要用nginx作为静态资源服务器，解决跨域的问题。  
从而可以在localhost服务上调试任何环境上的代码
```

## 用nginx作为静态资源服务的思考
- 想用webpack的hot-reload怎么办
- 开发中错误定位，怎么配置sourceMap
- 实时打包，这个很好处理

## 想来想去，只有动手写一个vue-ncli工具了

## webpack打包时错误，会在在命令工具中显示
```js
//直接配置webpack配置文件即可
devtool: '#cheap-module-eval-source-map',
```

## 程序级错误，在chrome控制可以直接定位到源文件
![error-location](/doc_images/error-location.gif)

## 重中之重，利用socket.io实现页面自动刷新 

### 服务器端代码/build/dev.server.js
通过fs.watchFile实时监测文件变化，正常情况下，我们只需要监测配置的生成的main.js文件即可，  
不过，你当然可以自定配置了。  
为什么只需要监测这一个文件，大家可以改动代码：css, js, vue自动观察文件的变化

```js
function createWatcher(file){
  if (watchers[file]) {
    return;
  }

  fs.watchFile(file, function (curr, prev) {
    if (curr.mtime !== prev.mtime) {
      io.sockets.emit('reload');
      console.log('Page has reloaded...');
    }
  });

  watchers[file] = true;
}
```

  监测到生成的文件/dist/static/js/main.js文件的变化，服务端向客户端推送*reload*事件

### 服务端同时要执行webpack命令
```js
//通过子进程，执行webpack命令
var pw = exec('webpack --config  ./build/webpack.config.js --process --colors --display-error-details -w');
//向父进程即process输出子进程的输出
pw.stdout.pipe(process.stdout);
```

### 在客户端实现socket.io连接
```html
<% if(!PRODUCTION){ %>
  <script type="text/javascript" src="/node_modules/socket.io-client/socket.io.js"></script>
  <script type="text/javascript">
    window.onload = function () {
      var socket = io.connect('http://localhost:8080');
      socket.on('reload', function () {
        window.location.reload();
      });
      
    }
  </script>
  <% } %>
```

#### 这里有几点需要说明的东西
1. <%%>是ejs语法，通过[html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin)插件编译
2. PRODUCTION常量通过webpack配置文件进行配置，保证只在开发环境中页面输出这些代码
```js
  new webpack.DefinePlugin({
      metadata: JSON.stringify(metadata),
      PRODUCTION: JSON.stringify(false)
  }),
```
3. *var socket = io.connect('http://localhost:8080');*这里面的地址要与config.js配置相同

## 所有的配置都在config.js文件中，仅仅是一个脚手架而，没有做成命令行工具

## 最后，nginx的配置使用请大家自行度娘吧，当然还包括socket.io，

## 最后的最后，安装使用
```
git clone git@github.com:twolun/vue-ncli.git 
cd vue-ncli  
npm install  

```

浏览器打开 
```
http://localhost/dist
```





