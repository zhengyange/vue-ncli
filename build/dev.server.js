var socketio = require('socket.io');
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
var socketServer = require('http').createServer(serverHandle);
var io = require('socket.io').listen(socketServer);
var config = require('./config.js');

socketServer.listen(config.socketServerPort);

var watchers = {};


var wFile = path.resolve(__dirname, config.watchFile);
//在这里执行
createWatcher(wFile);

function serverHandle(req, res){
	res.end();
}

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
//通过子进程，执行webpack命令
var pw = exec('webpack --config  ./build/webpack.config.js --process --colors --display-error-details -w');
pw.stdout.pipe(process.stdout);