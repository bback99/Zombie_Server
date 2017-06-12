var utils = require('../../../util/utils');

module.exports = function(app) {
	return new roomRemote(app);
};

var roomRemote = function(app) {
	this.app = app;
	this.roomService = app.get('roomService');
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
roomRemote.prototype.add = function(uid, playerName, X, Y, cb) {

    var users = this.roomService.addRoom(uid, playerName, X, Y);
	if (users) {
		cb(users);
	}
	else {
		console.error("ErrorCode: " + users);
	}
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
roomRemote.prototype.kick = function(uid, sid, cb) {
	this.roomService.leave(uid, sid);
	cb();
};