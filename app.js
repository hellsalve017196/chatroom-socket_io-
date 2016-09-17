var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	nicknames = [];

server.listen(3000);

// similar to document ready
io.sockets.on('connection',function(socket) {

	socket.on('new_user',function(data,callback) {
		if(nicknames.indexOf(data.user) != -1) {
			callback(false);
		}
		else {
			socket.nickname = data.user;
			nicknames.push(data.user);
			callback(true);

			io.sockets.emit('currently',{list : nicknames});
		}
	})

	socket.on('send_msg',function(data) {
		 data['nick'] = socket.nickname;
		 io.sockets.emit('new_msg',data);
	})

	socket.on('disconnect',function(data) {
		if(!socket.nickname) retrun;	

		nicknames.splice(nicknames.indexOf(socket.nickname),1);
		io.sockets.emit('currently',{list : nicknames});
	})

});



// routes

// route for html page to load
app.get('/',function(req,res) {
	res.sendfile(__dirname + '/index.html');
});


