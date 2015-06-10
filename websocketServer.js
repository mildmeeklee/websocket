/**
@author
eylee
mildmeeklee@gmail.com
2015.06.10
*/

var express = require('express');

// web development framework init!
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

var users = {};
server.listen(9995, function(){
	console.log('Listening on port 9995')
});

app.use(express.static(__dirname + '/www'));

var messageExchange = io.sockets.on('connection', function(socket){

	socket.channel = "";

	socket.on('new user', function(data, callback){
		
		if (data in users){
			callback(false);
		} else{
			console.log(data +' 님이 입장하였습니다.');
			callback(true);
			socket.nickname = data;
			users[socket.nickname] = socket;
			joinUser(data);
		}
	});
	
	socket.on('send message', function(data, callback){
		// io.sockets.emit('new message', {msg: data, nick: socket.nickname});
		console.log(data);
		var msg = data.trim();
		console.log('end message after trimming message is: ' + msg);
		io.sockets.emit('new message', {msg: msg, nick: socket.nickname});
		// io.sockets.emit('admin new message', {msg:msg, nick: 'admin'});
		io.sockets.emit('usernames', Object.keys(users));
		// io.socket.broadcast.emit('admin', {msg: msg, nick: socket.nickname});
		io.sockets.emit('admin', {msg: msg, nick: socket.nickname});

		
	});	

	// adminChat emit listen..
	
	socket.on('admin send msg', function(data, callback){
		callback;
		var msg = data.msg;
		var nickName = data.user;
		if(msg != undefined){
			msg = msg.trim();
		}
		if(nickName != undefined){
			nickName = nickName.trim();
		}
		console.log('after admin send msg,  trimming message is: ' + msg);
		console.log('nickName :: '+nickName);
		io.sockets.emit('new message', {msg: msg, nick: nickName, admin : true});
	})


	// 브라우저를 refresh , close 할 때
	socket.on('disconnect', function(data, callback){
		console.log("diconnect fire!!");
		callback;
		/*if(!socket.nickname) return;
		delete users[socket.nickname];
		// joinUser(socket.nickname);*/
	});

	function joinUser(user){
		console.log( Object.keys(users));
		// io.sockets.emit('usernames', Object.keys(users));
		io.sockets.emit('usernames', user);
		// io.sockets.broadcast.emit('admin', Object.keys(users));
		io.sockets.emit('admin', user);
		// io.sockets.emit('usernames', nicknames);
	}

});
