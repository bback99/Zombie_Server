var port = 13337;
var io = require('socket.io').listen(port);
console.log('Zombie Server is running on port: ' + port);

var tot_user_cnt = 0;

io.sockets.on('connection', function(socket) {
	
	++tot_user_cnt;
	
	console.log("New Client connected. : " + socket);

	// when user request login
	socket.on('add user', function(user_name) {
		socket.user_name = user_name;
		console.log("add user : " + user_name);
		socket.emit('login', {
        numUsers: tot_user_cnt,
      });
	});
	
	socket.on('new message', function(msg) {
		console.log('user: ' + socket.user_name + ', msg: ' + msg);
		
		socket.emit('new message', {
			username: socket.user_name,
			message: msg
		});
		
		socket.broadcast.emit('new message', {
			username: socket.user_name,
			message: msg
		}); 
	});
	
	// when the user disconnects.. perform this
	socket.on('disconnect', function () {
		console.log(socket.user_name + 'is disconnected, total_user_cnt: ' + --tot_user_cnt);
	});
});​