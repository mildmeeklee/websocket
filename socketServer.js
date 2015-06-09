


var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require("socket.io")(server);
// var nicknames = [];
var users = {};
server.listen(9995, function(){
    console.log('Listening on port 9995')
})
app.use(express.static(__dirname + '/www'));
io.sockets.on('connection', function(socket){
	// socket.on('send message', function(data){
	// 	console.log('send message :: '+data);
	// 	io.sockets.emit('new message', data);
	// })
	socket.on('new user', function(data, callback){
		/*if(nicknames.indexOf(data) != -1){
			callback(false);
		}else{
			callback(true);
			socket.nickname = data;
			console.log(data);
			nicknames.push(socket.nickname);
			updateNicknames();
		}*/
		if (data in users){
			callback(false);
		} else{
			callback(true);
			socket.nickname = data;
			users[socket.nickname] = socket;
			updateNicknames();
		}
	});

	socket.on('send message', function(data, callback){
		// io.sockets.emit('new message', {msg: data, nick: socket.nickname});
		var msg = data.trim();
		console.log('after trimming message is: ' + msg);
		io.sockets.emit('new message', {msg: msg, nick: socket.nickname});
		/*if(msg.substr(0,3) === '/w '){
			msg = msg.substr(3);
			var ind = msg.indexOf(' ');
			if(ind !== -1){
				var name = msg.substring(0, ind);
				var msg = msg.substring(ind + 1);
				if(name in users){
					console.log('users[name] :: '+users[name]);
					users[name].emit('whisper', {msg: msg, nick: socket.nickname});
					console.log('message sent is: ' + msg);
					console.log('Whisper!');
				} else{
					callback('Error!  Enter a valid user.');
				}
			} else{
				callback('Error!  Please enter a message for your whisper.');
			}
		} else{
			io.sockets.emit('new message', {msg: msg, nick: socket.nickname});
		}*/
	});
	
	socket.on('disconnect', function(data){
		// if(!socket.nickname) return;
		// nicknames.splice(nicknames.indexOf(socket.nickname), 1);
		// updateNicknames();
		if(!socket.nickname) return;
		delete users[socket.nickname];
		updateNicknames();
	});

	function updateNicknames(){
		io.sockets.emit('usernames', Object.keys(users));
		io.sockets.emit('admin', Object.keys(users));
		// io.sockets.emit('usernames', nicknames);
	}


	/**
	admin
	*/
	socket.on('admin', function(data, callback){
		var msg = data.trim();
		console.log('after trimming message is: ' + msg);
		io.sockets.emit('admin', {msg: msg, nick: 'admin'});
		
	});
})
/*io.on('connection', function(client) {
  client.on('messages', function(messages, client){
    console.log('messages :: '+messages);
   
	});
 
	client.emit('messages', { hello: 'world' });

  	console.log('Client connected...');
});*/


// app.get('/www', function (req, res) {
//  console.log(req.originalUrl); // '/admin/new'
//   console.log(req.baseUrl); // '/admin'
//   console.log(req.path); // '/new'
// res.sendFile(__dirname + '/index.html');
// });




/*
var PORT = 19999,
	express = require('express'),
	app = express();

app.use(express.static(__dirname + '/www'));

var io = require('socket.io').listen(app.listen(PORT));

io.sockets.on('connection', function (connection) {
	connection.on('message', function (message) {
		if (message.isHello) {
			this.set('name', message.name);
		}
		io.sockets.emit('message', message);
	});

	connection.on('disconnect', function () {
		this.get('name', function(err, name) {
			io.sockets.emit('message', {
				byebye:true,
				name: name,
			});
		});
	});
});

console.log("Web Server Started!! on " + PORT);
*/