module.exports = function(app) {
	return new roomRemote(app);
};

var roomRemote = function(app) {
	this.app = app;
	this.roomService = app.get('roomService');

    console.error("room: " + this.roomService);
};

/**
 * Add user into game channel.
 *
 * @param {String} uid unique id for user
 * @param {String} sid server id
 * @param {String} name channel name
 * @param {boolean} flag channel parameter
 *
 */
roomRemote.prototype.add = function(uid, sid, playerName, X, Y, cb) {

    console.error("2. name: " + playerName, ", X: " + X + ", Y: " + Y);

    var users = this.roomService.addRoom(uid, sid, playerName, X, Y);

    console.error("users: " + users.length);



	// var channel = this.roomService.getChannel(name, flag);
	// var username = uid.split('*')[0];
	// var param = {
	// 	route: 'onAdd',
	// 	user: username,
	// 	X: msg.X,
	// 	Y: msg.Y
	// };
	// channel.pushMessage(param);

	// if( !! channel) {
	// 	channel.add(uid, sid);
	// }

	// cb(this.get(name, flag));
};

/**
 * Get user from game channel.
 *
 * @param {Object} opts parameters for request
 * @param {String} name channel name
 * @param {boolean} flag channel parameter
 * @return {Array} users uids in channel
 *
 */
roomRemote.prototype.get = function(name, flag) {
	var users = [];
	var channel = this.channelService.getChannel(name, flag);
	if( !! channel) {
		users = channel.getMembers();
	}
	for(var i = 0; i < users.length; i++) {
		users[i] = users[i].split('*')[0];
	}
	return users;
};

/**
 * Kick user out game channel.
 *
 * @param {String} uid unique id for user
 * @param {String} sid server id
 * @param {String} name channel name
 *
 */
roomRemote.prototype.kick = function(uid, sid, name, cb) {
	var channel = this.channelService.getChannel(name, false);
	// leave channel
	if( !! channel) {
		channel.leave(uid, sid);
	}
	var username = uid.split('*')[0];
	var param = {
		route: 'onLeave',
		user: username
	};
	channel.pushMessage(param);
	cb();
};