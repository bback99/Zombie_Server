var port = 13337;
var io = require('socket.io').listen(port);
console.log('Zombie Server is running on port: ' + port);

var tot_user_cnt = 0;

io.sockets.on('connection', function(socket) {
	
	let timer = setInterval(intervalFunc, 3000);
	
	++tot_user_cnt;
	
	console.log("New Client connected. ( users: " + tot_user_cnt + ")");

	// when user request login
	socket.on('request login', function(user_name) {
		socket.user_name = user_name;
		console.log("login new user: " + socket.user_name);
		
		var x = Math.random() * (58 * 16);
		var y = Math.random() * (40 * 16);
		
		socket.emit('answer login', {
			username: socket.user_name,
			numUsers: tot_user_cnt,
			zombiePosition: {
				X: x,
				Y: y
			}
		});
		
		socket.broadcast.emit('notify login', {
			username: socket.user_name,
			numUsers: tot_user_cnt,
		});
	});
	
	function intervalFunc () {
		var x = Math.random() * (58 * 16);
		var y = Math.random() * (40 * 16);
		console.log("x: " +  x + ", y: " + y);
		socket.emit('notify spawn zombie', {
			zombiePosition: {
				X: x,
				Y: y
			}
		});
	}
	
	socket.on('request moving', function(position) {
		console.log('user: ' + socket.user_name + ', x: ' + position.X + ', y: ' + position.Y);
		
		socket.emit('notify moving', {
			username: socket.user_name,
			X: position.X,
			Y: position.Y
		});
		
		socket.broadcast.emit('notify moving', {
			username: socket.user_name,
			X: position.X,
			Y: position.Y
		}); 
	});
	
	// when the user disconnects.. perform this
	socket.on('disconnect', function () {
		console.log(socket.user_name + 'is disconnected, total_user_cnt: ' + --tot_user_cnt);
		clearInterval(timer);
	});
});

