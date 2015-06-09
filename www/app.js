/*var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require("socket.io").listen(server);

server.listen(3000);
// io.on('connection', function(client) {
// console.log('Client connected...');
// });


app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});
*/

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require("socket.io")(server);
io.on('connection', function(client) {
  client.on('messages', function(messages){
    console.log('messages :: '+messages);
  })
  client.emit('messages', { hello: 'world' });

  console.log('Client connected...');
});


app.get('/', function (req, res) {
res.sendFile(__dirname + '/index.html');
});
server.listen(9995, function(){
    console.log('Listening on port 9995')
   })
