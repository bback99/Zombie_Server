var port = 13337;
var io = require('socket.io').listen(port);
console.log('Zombie Server is running on port: ' + port);

class Client {
	constructor(name, x, y, angle) {
		this.user_name = name;
		this.posX = x;
		this.posY = y;
		this.angle = angle;
	}
}

var aryUsers = [];

io.sockets.on('connection', function(socket) {
	
	let timer = setInterval(intervalFunc, 3000);

	// when user request login
	socket.on('request login', function(user_name) {
		socket.user_name = user_name;
						
		var x = Math.random() * (58 * 16);
		var y = Math.random() * (40 * 16);
		
		
		var new_b = new Client("456", 100, 300, 0);
		aryUsers.push(new_b);
		
		// first of all, send to userlist that before new_user added
		socket.emit('answer login', {
			numUsers: aryUsers.length,
			aryUsers: aryUsers
		});
		
		// create new_user to send others
		var new_user = new Client(socket.user_name, 0, 0, 0);
		aryUsers.push(new_user);
		console.log("login new user: " + new_user.user_name);
		console.log("New Client connected. ( users: " + aryUsers.length + ")");

		socket.broadcast.emit('notify login', {
			numUsers: aryUsers.length,
			newUser: new_user
		});
	});
	
	function intervalFunc () {
		var x = Math.random() * (58 * 16);
		var y = Math.random() * (40 * 16);
		var angle = Math.random() * (360);
		// console.log("x: " +  x + ", y: " + y);
		// socket.emit('notify spawn zombie', {
			// zombiePosition: {
				// X: x,
				// Y: y
			// }
		// });
		
		// for notyMoving
		socket.emit('notify moving', {
			username: "456",
			X: x,
			Y: y,
			angle: angle
		});
	}
	
	socket.on('request moving', function(username, x, y, angle) {
		
		console.log('user: ' + username + ', x: ' + x + ', y: ' + y + ', angle: ' +  angle);
		
		for(var i=0; i<aryUsers.length; i++) {
			if (username == aryUsers[i].user_name) {
				aryUsers[i].posX = x;
				aryUsers[i].posY = y;
				aryUsers[i].angle = angle;
				break;
			}
		}
		
		socket.broadcast.emit('notify moving', {
			username: username,
			X: x,
			Y: y,
			angle: angle
		}); 
	});
	
	socket.on('request moving', function(position) {
		
		console.log('user: ' + socket.user_name + ', x: ' + position.X + ', y: ' + position.Y + ', angle: ' +  position.angle);
		
		for(var i=0; i<aryUsers.length; i++) {
			if (socket.user_name == aryUsers[i].user_name) {
				aryUsers[i].posX = position.X;
				aryUsers[i].posY = position.Y;
				aryUsers[i].angle = position.angle;
				break;
			}
		}
		
		socket.emit('notify moving', {
			username: socket.user_name,
			X: position.X,
			Y: position.Y,
			angle: position.angle
		});
		
		socket.broadcast.emit('notify moving', {
			username: socket.user_name,
			X: position.X,
			Y: position.Y,
			angle: position.angle
		}); 
	});
	
	// when the user disconnects.. perform this
	socket.on('disconnect', function () {
		
		clearInterval(timer);
		
		var index = 0;
		for(var i=0; i<aryUsers.length; i++) {
			if (socket.user_name == aryUsers[i].user_name) {
				index = i;
				break;
			}
		}
		aryUsers.splice(index, 1);
		
		console.log(socket.user_name + 'is disconnected, total_user_cnt: ' + aryUsers.length);
	});
});

